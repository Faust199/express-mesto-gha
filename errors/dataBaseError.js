class DataBaseError extends Error {
  constructor(message = 'Пользователь с таким email уже зарегистрирован') {
    super(message);
    this.name = 'DataBaseError';
    this.statusCode = 409;
  }
}

module.exports = DataBaseError;
