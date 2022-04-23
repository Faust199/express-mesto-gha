class RoleError extends Error {
  constructor(message) {
    super(message);
    this.name = 'roleError';
    this.statusCode = 403;
  }
}

module.exports = RoleError;
