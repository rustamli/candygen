"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var starterConfigs = "module.exports = {  \n  init: function () {\n    return {\n      schemaVersion: '1.0',\n      \n      rules: [\n        // {\n        //   template: '',\n        //   script: '',\n        //   data: '',\n        //   output: ''\n        // }\n      ]\n    }\n  }\n};\n";
var Initializer = /** @class */ (function () {
    function Initializer() {
    }
    Initializer.init = function (targetPath) {
        var configPath = path.join(targetPath, 'candygen.config.js');
        if (fs.existsSync(configPath)) {
            console.log('Error: configuration file already exists');
            console.log('please rename or remove it before re-initializing this directory');
        }
        else {
            fs.writeFileSync(configPath, starterConfigs, 'utf8');
            console.log('Created starter configuration: candygen.conf.js');
        }
    };
    return Initializer;
}());
exports.Initializer = Initializer;
//# sourceMappingURL=Initializer.js.map