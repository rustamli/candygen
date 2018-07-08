export declare class DevServer {
    private targetPath;
    private settings;
    private generator;
    constructor(targetPath: string);
    start(port?: number): void;
    private initWatch;
    private isNotOutputFilePath;
    private handleChanged;
    private changeStaticFile;
    private handleRemoved;
    private removeStaticFile;
    private reGenerate;
}
