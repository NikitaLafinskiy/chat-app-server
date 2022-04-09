export class ApiError extends Error {
  status: number;
  message: string;
  name: string;
  errors: string[];

  constructor(
    status: number,
    name: string,
    message: string,
    errors: string[] = []
  ) {
    super(message);
    this.status = status;
    this.name = name;
    this.errors = errors;
  }

  static UnauthorizedError(message: string) {
    return new ApiError(401, 'Unauthorized request', message);
  }

  static BadRequestError(message: string, errors: string[] = []) {
    return new ApiError(400, 'Bad Request', message, errors);
  }
}
