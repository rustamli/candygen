
var fs = require('fs'),
    path = require('path'),
    parseXML = require('xml2js').parseString;

module.exports = {
    loadSettings (targetPath, tempOutputPath) {
        var out = null;

        const configPath = path.join(targetPath, '/candygen.config.js');

        if (fs.existsSync(configPath)) {
            delete require.cache[configPath];
            out = require(configPath).init();
            out.templates = {};
            out.targetPath = targetPath;
            out.dfcache = {};
            out.tempOutputPath = tempOutputPath;
        } else {
            out = this.loadSettingsXml(targetPath);    
        }

        return out;
    },

    loadSettingsXml: function (targetPath) {
        var source = fs.readFileSync(path.join(targetPath, '/generator.xml'), 'utf8'),
            settings = null;

        var createSettings = function (parsedXML) {
            var GS = parsedXML.GeneratorSettings,
                settings = {
                    version: GS.$.version,
                    partials: [],
                    rules: [],
                    templates: {},
                    targetPath: targetPath,
                    dfcache: {}
                };

            if (GS.partials && GS.partials.length > 0 && GS.partials[0].partial) {
                GS.partials[0].partial.forEach(function (partial) {
                    settings.partials.push(partial.$);
                });
            }

            if (GS.rules && GS.rules.length > 0 && GS.rules[0].rule) {
                GS.rules[0].rule.forEach(function (rule) {
                    settings.rules.push(rule.$);
                });
            }

            settings.rules.forEach(function (rule) {
                if (!settings.templates.hasOwnProperty(rule.template)) {
                    settings.templates[rule.template] = [];
                }

                settings.templates[rule.template].push(rule);
            });

            return settings;
        };

        parseXML(source, { async: false }, function (err, result) {
            settings = createSettings(result);
        });

        return settings;
    }
};