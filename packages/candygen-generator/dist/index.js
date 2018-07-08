"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * candygen Generator
 * Author: Turan Rustamli <turan@rustam.li>
 */
var fsExtra = __importStar(require("fs-extra"));
var path = __importStar(require("path"));
var Handlebars = __importStar(require("handlebars"));
var SettingsLoader_1 = require("./util/SettingsLoader");
exports.SettingsLoader = SettingsLoader_1.SettingsLoader;
var Initializer_1 = require("./util/Initializer");
exports.Initializer = Initializer_1.Initializer;
var Generator = /** @class */ (function () {
    function Generator(targetPath) {
        this.settings = SettingsLoader_1.SettingsLoader.load(targetPath);
        this.initHelpers();
        this.initPartials();
    }
    Generator.prototype.initHelpers = function () {
        if (this.settings.helpers) {
            this.settings.helpers.forEach(function (helper) {
                Handlebars.registerHelper(helper.name, helper.fn);
            });
        }
    };
    Generator.prototype.initPartials = function () {
        var _this = this;
        if (this.settings.partials) {
            this.settings.partials.forEach(function (partial) {
                var partialSource = fsExtra.readFileSync(path.join(_this.settings.inputPath, partial.template), 'utf8');
                Handlebars.registerPartial(partial.name, partialSource);
            });
        }
    };
    Generator.prototype.run = function () {
        this.cleanOutputDirectory();
        this.copyStatic();
        this.runRules();
    };
    Generator.prototype.cleanOutputDirectory = function () {
        fsExtra.removeSync(this.settings.outputPath);
        fsExtra.mkdir(this.settings.outputPath);
    };
    Generator.prototype.copyStatic = function () {
        try {
            var staticFilesPath = path.join(this.settings.inputPath, '/static');
            fsExtra.copySync(staticFilesPath, this.settings.outputPath);
        }
        catch (e) {
            console.warn('Static files were not found.');
        }
    };
    Generator.prototype.runRules = function () {
        var _this = this;
        this.settings.rules.forEach(function (rule) {
            _this.runRule(rule);
        });
    };
    Generator.prototype.runRule = function (rule) {
        var template = this.compileTemplate(path.join(this.settings.inputPath, rule.template));
        var data = this.loadPagesData(rule);
        data = this.processScript(rule, data);
        this.renderOutput(rule, data, template);
    };
    Generator.prototype.renderOutput = function (rule, data, template) {
        var _this = this;
        var pageNum = 1;
        data.pages.forEach(function (page) {
            var fileName = '/' + rule.output.replace('@ID@', page.pageId).replace('@PAGENUM@', pageNum.toString());
            var renderedContent;
            try {
                renderedContent = template(page);
            }
            catch (e) {
                console.error('Error: templating error while processing ' + rule.template);
                throw e;
            }
            fsExtra.writeFileSync(path.join(_this.settings.outputPath, fileName), renderedContent, 'utf8');
            pageNum += 1;
        });
    };
    Generator.prototype.processScript = function (rule, data) {
        var finalData = data;
        if (rule.script) {
            var scriptPath = path.join(this.settings.inputPath, rule.script);
            var script = require(scriptPath);
            if (script && script.run) {
                finalData = script.run(data);
            }
        }
        return finalData;
    };
    Generator.prototype.loadPagesData = function (rule) {
        var data = {
            pages: [{}]
        };
        if (rule.data) {
            var dataPath = path.join(this.settings.inputPath, rule.data);
            var dataJson = fsExtra.readFileSync(dataPath, 'utf8');
            data = JSON.parse(dataJson);
        }
        return data;
    };
    Generator.prototype.compileTemplate = function (templatePath) {
        var source = fsExtra.readFileSync(templatePath, 'utf8');
        return Handlebars.compile(source);
    };
    return Generator;
}());
exports.Generator = Generator;
//# sourceMappingURL=index.js.map