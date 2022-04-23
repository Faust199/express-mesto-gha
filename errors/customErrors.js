const ValidationError = require('./validationError');
const DefaultError = require('./defaultError');
const DataBaseError = require('./dataBaseError');

const handleError = (err) => {
  if (err.code === 11000) {
    const dataBaseError = new DataBaseError(err.message);
    return dataBaseError;
  }

  if (err.name === 'ValidationError' || 'CastError') {
    const validationError = new ValidationError(err.message);
    return validationError;
  }

  const defaultError = new DefaultError();
  return defaultError;
};

module.exports = handleError;
