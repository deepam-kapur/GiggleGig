class ErrorHelper extends Error {
  constructor(message, code, payload) {
    super(message);
    this.status = false;
    this.code = code;
    this.payload = payload;

    Error.captureStackTrace(this, this.constructor);
  }

  get() {
    return {
      status: this.status,
      code: this.code,
      message: this.message,
      payload: this.payload || undefined,
    };
  }

  static create(message, code = 500, payload = null) {
    return new ErrorHelper(message, code, payload);
  }
}

export default ErrorHelper;
