import { Rule } from './Rule';
import { Helper } from './Helper';
import { Partial } from './Partial';
export interface GeneratorSettings {
    inputPath: string;
    outputPath: string;
    rules: Rule[];
    partials: Partial[];
    helpers?: Helper[];
}
