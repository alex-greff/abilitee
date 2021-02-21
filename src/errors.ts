export class ClassConstructorTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClassConstructorTypeError";
  }
}