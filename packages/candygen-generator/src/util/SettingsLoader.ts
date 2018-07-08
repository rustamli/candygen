
import { GeneratorSettings } from '../interfaces/GeneratorSettings';
import { GeneratorError } from '../errors/GeneratorError'
import * as fs from 'fs';
import * as path from 'path';


export class SettingsLoader {
  public static load (targetPath: string): GeneratorSettings {
    var out: GeneratorSettings;

    const configPath = path.join(targetPath, 'candygen.config.js');

    if (fs.existsSync(configPath)) {
        delete require.cache[configPath];
        out = require(configPath).init();

        if (!out.inputPath) {
          out.inputPath = targetPath;
        }

        if (!out.outputPath) {
          out.outputPath = './output';
        }
    } else {
        throw new GeneratorError('Configuration file <candygen.config.js> was not found.');
    }

    return out;
  }
}