"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * candygen DevServer
 * Author: Turan Rustamli <turan@rustam.li>
 */
var generator_1 = require("@candygen/generator");
var express_1 = __importDefault(require("express"));
var opener_1 = __importDefault(require("opener"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var watch_1 = __importDefault(require("watch"));
var DevServer = /** @class */ (function () {
    function DevServer(targetPath) {
        this.targetPath = targetPath;
        this.settings = generator_1.SettingsLoader.load(targetPath);
        this.generator = new generator_1.Generator(targetPath);
    }
    DevServer.prototype.start = function (port) {
        var _this = this;
        if (port === void 0) { port = 8000; }
        var app = express_1.default();
        app.use(express_1.default.static(this.settings.outputPath));
        app.use(function (req, res) {
            res.status(404).sendFile(path_1.default.join(_this.settings.outputPath, '404.html'));
        });
        this.generator.run();
        console.log('Output is ready.');
        this.initWatch();
        app.listen(port, function () {
            console.log('Go to: http://localhost:' + port);
            opener_1.default('http://localhost:' + port);
        });
    };
    DevServer.prototype.initWatch = function () {
        var _this = this;
        watch_1.default.createMonitor(this.settings.inputPath, function (monitor) {
            monitor.on('created', function (f, stat) {
                _this.handleChanged(f.toString());
            });
            monitor.on('changed', function (f, curr, prev) {
                _this.handleChanged(f.toString());
            });
            monitor.on('removed', function (f, stat) {
                _this.handleRemoved(f.toString());
            });
        });
    };
    DevServer.prototype.isNotOutputFilePath = function (filePath) {
        var fullOutputPath = path_1.default.resolve(this.targetPath, this.settings.outputPath);
        return filePath.indexOf(fullOutputPath) === -1;
    };
    DevServer.prototype.handleChanged = function (filePath) {
        var _this = this;
        if (this.isNotOutputFilePath(filePath)) {
            if (filePath.indexOf('static') > -1) {
                this.changeStaticFile(filePath);
                console.log('Static file updated: ', filePath);
            }
            else {
                // on template changes only run affected rules
                var templateChanged = false;
                this.settings.rules.forEach(function (rule) {
                    var ruleTemplateFilePath = path_1.default.join(_this.settings.inputPath, rule.template);
                    if (filePath === ruleTemplateFilePath) {
                        templateChanged = true;
                        _this.generator.runRule(rule);
                    }
                });
                // otherwise run all the rules
                if (!templateChanged) {
                    this.reGenerate();
                }
            }
            console.log('processed event [file changed]: ', filePath);
        }
    };
    DevServer.prototype.changeStaticFile = function (filePath) {
        var staticPrefix = path_1.default.join(this.settings.inputPath, '/static');
        fs_1.default.writeFileSync(filePath.replace(staticPrefix, this.settings.outputPath), fs_1.default.readFileSync(filePath));
    };
    DevServer.prototype.handleRemoved = function (filePath) {
        if (this.isNotOutputFilePath(filePath)) {
            if (filePath.indexOf('static') > -1) {
                this.removeStaticFile(filePath);
                console.log('Static file removed: ', filePath);
            }
            else {
                this.reGenerate();
            }
            console.log('processed event [file removed]: ', filePath);
        }
    };
    DevServer.prototype.removeStaticFile = function (filePath) {
        var staticPrefix = path_1.default.join(this.settings.inputPath, '/static');
        try {
            fs_1.default.unlinkSync(filePath.replace(staticPrefix, this.settings.outputPath));
        }
        catch (e) {
        }
    };
    DevServer.prototype.reGenerate = function () {
        this.generator.initPartials();
        this.generator.initHelpers();
        this.generator.runRules();
    };
    return DevServer;
}());
exports.DevServer = DevServer;
//# sourceMappingURL=index.js.map