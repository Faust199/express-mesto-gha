class DefaultError extends Error {
  constructor(message = 'Что то пошло не так') {
    super(message);
    this.name = 'defaultError';
    this.statusCode = 500;
  }
}

module.exports = DefaultError;
