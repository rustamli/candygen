/// <reference types="handlebars" />
import { GeneratorSettings } from './interfaces/GeneratorSettings';
import { SettingsLoader } from './util/SettingsLoader';
import { Rule } from './interfaces/Rule';
import { PagesData } from './interfaces/PagesData';
import { Initializer } from './util/Initializer';
export declare class Generator {
    private settings;
    constructor(targetPath: string);
    initHelpers(): void;
    initPartials(): void;
    run(): void;
    private cleanOutputDirectory;
    private copyStatic;
    runRules(): void;
    runRule(rule: Rule): void;
    private renderOutput;
    private processScript;
    private loadPagesData;
    compileTemplate(templatePath: string): HandlebarsTemplateDelegate;
}
export { Rule as Rule };
export { PagesData as PagesData };
export { Initializer as Initializer };
export { SettingsLoader as SettingsLoader };
export { GeneratorSettings as GeneratorSettings };
