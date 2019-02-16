export class HttpError extends Error implements Error {
  stack?: string;

  constructor(public message: string, public status: number = 500, public name: string = 'HttpError') {
    super(message);
    this.name = name;
    this.message = message;
    this.status = status;
  }
}

export class ValidationError extends HttpError {
  errors: {}[];
  constructor(errors: {}[]) {
    super('Bad request', 400, 'ValidationError');
    this.errors = errors;
  }
}
