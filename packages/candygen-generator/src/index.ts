/**
 * candygen Generator
 * Author: Turan Rustamli <turan@rustam.li>
 */
import * as fsExtra from 'fs-extra'
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { GeneratorSettings } from './interfaces/GeneratorSettings'
import { SettingsLoader } from './util/SettingsLoader'
import { Rule } from './interfaces/Rule';
import { PagesData } from './interfaces/PagesData';
import { Initializer } from './util/Initializer';

export class Generator {
  private settings: GeneratorSettings;

  public constructor(targetPath: string) {
    this.settings = SettingsLoader.load(targetPath);
    this.initHelpers();
    this.initPartials();
  }

  public initHelpers() {
    if (this.settings.helpers) {
      this.settings.helpers.forEach((helper) => {
        Handlebars.registerHelper(helper.name, helper.fn);
      });
    }
  }

  public initPartials() {
    if (this.settings.partials) {
      this.settings.partials.forEach((partial) => {
        let partialSource = fsExtra.readFileSync(path.join(this.settings.inputPath, partial.template), 'utf8');
        Handlebars.registerPartial(partial.name, partialSource);
      });
    }
  }

  public run() {
    this.cleanOutputDirectory();
    this.copyStatic();
    this.runRules();
  }

  private cleanOutputDirectory() {
    fsExtra.removeSync(this.settings.outputPath);
    fsExtra.mkdir(this.settings.outputPath);
  }

  private copyStatic() {
    try {
        let staticFilesPath = path.join(this.settings.inputPath, '/static');
        fsExtra.copySync(staticFilesPath, this.settings.outputPath);
    } catch (e) {
        console.warn( 'Static files were not found.');
    }
  }

  public runRules() {
    this.settings.rules.forEach((rule) => {
      this.runRule(rule);
    });
  }

  public runRule(rule: Rule) {
    let template = this.compileTemplate(path.join(this.settings.inputPath, rule.template));
    let data = this.loadPagesData(rule);
    data = this.processScript(rule, data);
    this.renderOutput(rule, data, template);
  }
  
  private renderOutput(rule: Rule, data: PagesData, template: Handlebars.TemplateDelegate<any>) {
    var pageNum = 1;
    data.pages.forEach((page) => {
      let fileName = '/' + rule.output.replace('@ID@', page.pageId).replace('@PAGENUM@', pageNum.toString());
      let renderedContent;
      try {
        renderedContent = template(page);
      } catch (e) {
        console.error('Error: templating error while processing ' + rule.template);
        throw e;
      }
      fsExtra.writeFileSync(path.join(this.settings.outputPath, fileName), renderedContent, 'utf8');
      pageNum += 1;
    });
  }

  private processScript(rule: Rule, data: any): PagesData {
    let finalData: PagesData = data as PagesData; 
    if (rule.script) {
      let scriptPath = path.join(this.settings.inputPath, rule.script);
      let script = require(scriptPath);

      if (script && script.run) {
        finalData = script.run(data);
      }
    }
    return finalData;
  }

  private loadPagesData(rule: Rule) {
    let data: PagesData = {
      pages: [{}]
    };
    if (rule.data) {
      let dataPath = path.join(this.settings.inputPath, rule.data);
      let dataJson = fsExtra.readFileSync(dataPath, 'utf8');
      data = JSON.parse(dataJson);
    }
    return data;
  }

  public compileTemplate(templatePath: string): HandlebarsTemplateDelegate {
    let source = fsExtra.readFileSync(templatePath, 'utf8');
    return Handlebars.compile(source);
  }
}

export { Rule as Rule };
export { PagesData as PagesData };
export { Initializer as Initializer };
export { SettingsLoader as SettingsLoader };
export { GeneratorSettings as GeneratorSettings };

