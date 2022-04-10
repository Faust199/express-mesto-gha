// eslint-disable-next-line max-classes-per-file
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'validationError';
    this.statusCode = 400;
  }
}

class ObjectNotFoundError extends Error {
  constructor(message = 'Сущность с таким id не найдена') {
    super(message);
    this.name = 'objectNotFoundError';
    this.statusCode = 404;
  }
}

class DefaultError extends Error {
  constructor(message = 'Что то пошло не так') {
    super(message);
    this.name = 'defaultError';
    this.statusCode = 500;
  }
}

const handleError = (err) => {
  if (err.name === 'ValidationError' || 'CastError') {
    const validationError = new ValidationError(err.message);
    return validationError;
  }

  if (err.name === 'CastError') {
    const objectNotFoundError = new ObjectNotFoundError();
    return objectNotFoundError;
  }

  const defaultError = new DefaultError();
  return defaultError;
};

module.exports = handleError;
