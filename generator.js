
var fs = require('fs'),
    fsExtra = require('fs-extra'),
    path = require('path'),
    Handlebars = require('handlebars'),
    writefile = require('writefile'),
    wrench = require('wrench'),
    CSON = require('cson-parser'),
    marked = require('marked'),
    oxhelpers = require('./oxhelpers'),
    settingsLoader = require('./settings-loader'),
    _ = require('lodash'),
    _settings;

module.exports = {
    run: function (targetPath, tempOutputPath) {
        _settings = settingsLoader.loadSettings(targetPath);
        _settings.tempOutputPath = tempOutputPath;

        console.log('Generating ...');

        this.copyStaticFiles();
	    console.log('Running rules ...');

        this.initHandlebars();
        this.processRules();

        console.log('READY.');

        return _settings;
    },

    fullReRun: function () {
        console.log('Re-generating ...');

        delete _settings.dfcache;
        _settings.dfcache = {};

        this.initHandlebars();
        this.processRules();

        console.log('READY.');
    },

    copyStaticFiles: function () {
        try {
            var staticFilesPath = path.join(_settings.targetPath, '/static');
            wrench.copyDirSyncRecursive(staticFilesPath, _settings.tempOutputPath, {
                forceDelete: true
            });
        } catch (e) {
            console.warn('Static files were not found');
        }

        try {
            var staticDataFilesPath = path.join(_settings.targetPath, '/data/static');
            wrench.copyDirSyncRecursive(staticDataFilesPath, path.join(_settings.tempOutputPath, '/data'), {
                forceDelete: true
            });
        } catch (e) {
            console.warn('Static data files were not found');
        }

        if (_settings.extras.length > 0) {
            _settings.extras.forEach(function (extra) {
                var extraModuleMapping = {
                    'firebase-tools': 'candygen-firebase',
                    'email-tools': 'candygen-email'
                };
                try {
                    var extraFilesPath = path.join(_settings.targetPath, 
                        '/node_modules/' + extraModuleMapping[extra.name] + '/static');
                    fsExtra.copySync(extraFilesPath, _settings.tempOutputPath);
                } catch (e) {
                    console.warn('Extra files were not found');
                }
            });
        }
    },

    initHandlebars: function () {
        _settings.partials.forEach(function (partial) {
            var source = fs.readFileSync(path.join(_settings.targetPath, '/' + partial.template), 'utf8');
            Handlebars.registerPartial(partial.name, source);
        });

        oxhelpers.register(Handlebars);
    },

    processRules: function () {
        var generator = this;
        _settings.rules.forEach(function (rule) {
            generator.runRule(rule);
        });
    },

    runRule: function (rule) {
        var generator = this,
            templateSource = generator.readTemplateSource(rule.template),
            template = generator.tryCompileTemplateSource(templateSource),
            data = {},
            pageNum = 1;

        if (rule.datafile) {
            var dataString = fs.readFileSync(path.join(_settings.targetPath, '/' + rule.datafile), 'utf8');

            if (generator.hasExtension(rule.datafile, '.json')) {
                data = JSON.parse(dataString);
            } else if (generator.hasExtension(rule.datafile, '.cson')) {
                data = CSON.parse(dataString);
            } else {
                data = { pages: [ generator.importDataFromFile(rule.datafile) ] };
            }

        } else if (rule.datafolder) {
            data = generator.importDataFromFolder(rule.datafolder);
        }

        if (rule.transform) {
            var transformPath = path.join(_settings.targetPath, '/' + rule.transform),
                transform = require(transformPath);

            if (transform && transform.run) {
                data = transform.run(data, {
                    _: _,
                    handlebars: Handlebars,
                    marked: marked
                });
            }
        }

        if (data.pages) {
            data.pages.forEach(function (page) {
                if (generator.pageConstructors.hasOwnProperty(rule.ds)) {
                    generator.pageConstructors[rule.ds](page, rule);
                }
			
                var fileName = '/' + rule.output.replace('@ID@', page.pageId)
                        .replace('@PAGENUM@', pageNum);										
				
		page._page = {
		    path: fileName.substr(0, fileName.lastIndexOf('/')) + '/',
		    fullPath: fileName,
		    name: fileName.substr(1 + fileName.lastIndexOf('/'))
		};
		
		var fileContent = generator.tryApplyTemplate(template, page, rule.template);

                writefile(path.join(_settings.tempOutputPath,  fileName), fileContent);

                pageNum += 1;
            });
        }
    },

    hasExtension: function (filePath, extension) {
        return filePath.indexOf(extension, filePath.length - extension.length) !== -1;
    },

    splitInTwo: function (str, splitOn) {
        var parts = str.split(splitOn);
        return parts.length > 1 ? [ parts.shift(), parts.join(splitOn) ] : parts;
    },

    importDataFromFolder: function (dataFolder) {
        var data;

        if (_settings.dfcache.hasOwnProperty(dataFolder)) {
            data = _.cloneDeep(_settings.dfcache[dataFolder]);
        } else {
            var folderPath = path.join(_settings.targetPath, dataFolder),
                generator = this;

            var files = wrench.readdirSyncRecursive(folderPath);

            data = {pages: []};
            files.forEach(function (file) {
                if (generator.hasExtension(file, '.md') || generator.hasExtension(file, '.html')) {
                    var filePath = path.join(folderPath, '/' + file),
                        page = generator.importDataFromFile(filePath);

                    data.pages.push(page);
                }
            });

            _settings.dfcache[dataFolder] = data;
            data = _.cloneDeep(_settings.dfcache[dataFolder]);
        }

        return data;
    },

    importDataFromFile: function (filePath) {
        var generator = this,
            contentString = fs.readFileSync(filePath, 'utf8'),
            contentSplit = generator.splitInTwo(contentString, '---'),
            page = {};

        if (contentSplit.length > 0) {
            var attrs = contentSplit[0].split('\n');

            attrs.forEach(function (attr) {
                var attrParts = generator.splitInTwo(attr.trim(), ':');
                if (attrParts.length > 1) {
                    var key = attrParts[0].trim();
                    page[key] = attrParts[1].trim();
                }
            });

            page.content = contentSplit.length > 1 ? contentSplit[1].trim() : '';

            if (this.hasExtension(filePath, '.md')) {
                page.content = marked(page.content);
            }
        }

        return page;
    },

    tryCompileTemplateSource: function (templateSource) {
        var template;
        try {
            template = Handlebars.compile(templateSource);
        } catch (err) {
            console.error(err);
            template = Handlebars.compile('Handlebars Compilation Error: <br> <pre>' + err + '</pre>');
        }
        return template;
    },

    tryApplyTemplate: function (template, data, fileName) {
        var output;
        try {
            output = template(data);
        } catch (err) {
            console.error(fileName, err);
            output = '<h1>Handlebars Error:</h1> <br> <b>' + fileName + '</b> <br> <pre style="color: red;">' + err + '</pre>';
        }
        return output;
    },

    readTemplateSource: function (templatePath) {
        var source = fs.readFileSync(path.join(_settings.targetPath, '/' + templatePath), 'utf8');

        if (source.indexOf('{{=<% %>=}}') > -1) {
            source = this.processEscapes(source);
        }

        return source;
    },

    processEscapes: function (source) {
        var sourcePartsStart = source.split('{{=<% %>=}}'),
            sourcePartsEnd,
            escapedPart;

        if (sourcePartsStart.length > 1) {
            sourcePartsEnd = sourcePartsStart[1].split('<%={{ }}=%>');
            escapedPart = sourcePartsEnd[0].replace(/([^{]){{/g, '$1\\{{');
            source = sourcePartsStart[0] + escapedPart + sourcePartsEnd[1];
        }

        return source;
    },

    pageConstructors: {
        WS_PROPOSAL_LIST_PAGES_DS: function (page, rule) {
            page.itemsType = rule.type;

            if (page.proposals) {
                // itemsType hack
                page.proposals.forEach(function (proposal) {
                    proposal.itemsType = page.itemsType;
                });
            }
        }
    },

    isRuleTemplateFile: function (fileName) {
        return _settings.templates[fileName];
    },

    handleChange: function (f, curr, prev) {
        var staticPrefix = path.join(_settings.targetPath, '/static'),
            generator = this,
            templatePath;

        if (f) {
            if (f.indexOf('static') > -1) {
                fs.writeFileSync(f.replace(staticPrefix, _settings.tempOutputPath), fs.readFileSync(f));
                console.log('Static file updated: ', f);
            } else {
                templatePath = f.replace(path.join(_settings.targetPath, '/'), '').replace(/\\/g, '/');

                if (this.isRuleTemplateFile(templatePath)) {
                    console.log('Re-running rules for template: ', templatePath);
                    _settings.templates[templatePath].forEach(function (rule) {
                        generator.runRule(rule);
                    });
                    console.log('DONE.');
                } else if (f.indexOf('generator.xml') > -1) {
                    _settings = settingsLoader.loadSettings(_settings.targetPath);
                    this.fullReRun();
                } else {
                    this.fullReRun();
                }
            }
        }
    }
};
