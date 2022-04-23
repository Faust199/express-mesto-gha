class ObjectNotExistError extends Error {
  constructor(message) {
    super(message);
    this.name = 'objectNotExistError';
    this.statusCode = 404;
  }
}

module.exports = ObjectNotExistError;
