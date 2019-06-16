const crypto = require('crypto');

module.exports = origin => {
  return crypto.pbkdf2Sync(origin, process.env.API_SALT, process.env.API_SALT_ITERATION, process.env.API_KEY_LENGTH, process.env.API_DIGEST).toString('hex');
}
