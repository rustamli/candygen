/**
 * candygen DevServer
 * Author: Turan Rustamli <turan@rustam.li>
 */
import { Generator, SettingsLoader, GeneratorSettings } from '@candygen/generator';
import express, { Application, Request, Response } from 'express';
import opener from 'opener';
import path from 'path';
import fs from 'fs';
import watch, { FileOrFiles } from 'watch';

export class DevServer {
  private targetPath: string;
  private settings: GeneratorSettings;
  private generator: Generator;

  public constructor(targetPath: string) {
    this.targetPath = targetPath;
    this.settings = SettingsLoader.load(targetPath);
    this.generator = new Generator(targetPath);
  }

  public start(port: number = 8000) {
    const app: Application = express();

    app.use(express.static(this.settings.outputPath));

    app.use((req: Request, res: Response) => {
      res.status(404).sendFile(path.join(this.settings.outputPath, '404.html'));
    });

    this.generator.run();
    console.log('Output is ready.');

    this.initWatch();

    app.listen(port, () => {
      console.log('Go to: http://localhost:' + port);
      opener('http://localhost:' + port);
    });
  }

  private initWatch() {
    watch.createMonitor(this.settings.inputPath, (monitor) => {
      monitor.on('created', (f, stat) => {
        this.handleChanged(f.toString());
      });
      monitor.on('changed', (f, curr, prev) => {
        this.handleChanged(f.toString());
      });
      monitor.on('removed', (f, stat) => {
        this.handleRemoved(f.toString());
      });
    });
  }

  private isNotOutputFilePath(filePath: string) {
    const fullOutputPath = path.resolve(this.targetPath, this.settings.outputPath);
    return filePath.indexOf(fullOutputPath) === -1;
  }

  private handleChanged(filePath: string) {
    if (this.isNotOutputFilePath(filePath)) {
      if (filePath.indexOf('static') > -1) {
        this.changeStaticFile(filePath);
        console.log('Static file updated: ', filePath);
      } else {
        // on template changes only run affected rules
        var templateChanged = false;
        this.settings.rules.forEach((rule) => {
          const ruleTemplateFilePath = path.join(this.settings.inputPath, rule.template);
          if (filePath === ruleTemplateFilePath) {
            templateChanged = true;
            this.generator.runRule(rule);
          }
        });

        // otherwise run all the rules
        if (!templateChanged) {
          this.reGenerate();
        }
      }

      console.log('processed event [file changed]: ', filePath);
    }
  }

  private changeStaticFile(filePath: string) {
    var staticPrefix = path.join(this.settings.inputPath, '/static');
    fs.writeFileSync(filePath.replace(staticPrefix, this.settings.outputPath), fs.readFileSync(filePath));
  }

  private handleRemoved(filePath: string) {
    if (this.isNotOutputFilePath(filePath)) {
      if (filePath.indexOf('static') > -1) {
        this.removeStaticFile(filePath);
        console.log('Static file removed: ', filePath);
      } else {
        this.reGenerate();
      }
      console.log('processed event [file removed]: ', filePath);
    }
  }

  private removeStaticFile(filePath: string) {
    var staticPrefix = path.join(this.settings.inputPath, '/static');
    try {
    fs.unlinkSync(filePath.replace(staticPrefix, this.settings.outputPath));
    } catch (e) {
    }
  }

  private reGenerate() {
    this.generator.initPartials();
    this.generator.initHelpers();
    this.generator.runRules();
  }
}