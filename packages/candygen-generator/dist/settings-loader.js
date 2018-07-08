"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var GeneratorError_1 = require("./errors/GeneratorError");
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var SettingsLoader = /** @class */ (function () {
    function SettingsLoader() {
    }
    SettingsLoader.load = function (targetPath) {
        var out;
        var configPath = path.join(targetPath, '/candygen.config.js');
        if (fs.existsSync(configPath)) {
            delete require.cache[configPath];
            out = require(configPath).init();
            if (!out.inputPath) {
                out.inputPath = targetPath;
            }
            if (!out.outputPath) {
                out.outputPath = './output';
            }
        }
        else {
            throw new GeneratorError_1.GeneratorError('Candygen configuration file <candygen.config.js> was not found.');
        }
        return out;
    };
    return SettingsLoader;
}());
exports.SettingsLoader = SettingsLoader;
