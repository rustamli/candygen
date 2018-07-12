
export class GeneratorError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'GeneratorError';
    this.stack = (<any> new Error()).stack;
  }
}