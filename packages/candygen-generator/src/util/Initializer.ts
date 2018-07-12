
import * as path from 'path';
import * as fs from 'fs';

const starterConfigs = `module.exports = {  
  init: function () {
    return {
      schemaVersion: '1.0',
      
      rules: [
        // {
        //   template: '',
        //   script: '',
        //   data: '',
        //   output: ''
        // }
      ]
    }
  }
};
`;

export class Initializer {
  public static init(targetPath: string) {
    let configPath = path.join(targetPath, 'candygen.config.js');
    if (fs.existsSync(configPath)) {
      console.log('Error: configuration file already exists');
      console.log('please rename or remove it before re-initializing this directory');
    } else {
      fs.writeFileSync(configPath, starterConfigs, 'utf8');
      console.log('Created starter configuration: candygen.conf.js');
    }
  }
}
