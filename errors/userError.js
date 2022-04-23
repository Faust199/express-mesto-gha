class UserError extends Error {
  constructor(message) {
    super(message);
    this.name = 'userError';
    this.statusCode = 401;
  }
}

module.exports = UserError;
