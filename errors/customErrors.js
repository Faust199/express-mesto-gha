const ValidationError = require('./validationError');
const DefaultError = require('./defaultError');

const handleError = (err) => {
  if (err.name === 'ValidationError' || 'CastError') {
    const validationError = new ValidationError(err.message);
    return validationError;
  }

  const defaultError = new DefaultError();
  return defaultError;
};

module.exports = handleError;
