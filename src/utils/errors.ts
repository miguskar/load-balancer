export class HttpError implements Error {
    name: string;
    message: string;
    stack?: string | undefined;
    status?: number;

    constructor(message: string, status: number = 500, name: string = 'HttpError') {
        this.name = name;
        this.message = message;
        this.status = status;
    }
}

export class ValidationError extends HttpError {
    errors: {}[];
    constructor(errors: {}[]) {
        super('Invalid body', 400, 'ValidationError');
        this.errors = errors;
    }
}