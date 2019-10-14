const validations = require('../../src/shared/model-validations');

module.exports = {

  // DB
  dbUri: process.env.DB_URL,

  logging: {
    dbUri: process.env.DB_LOGGING_URL 
  },

  // jsonwebtoken secret
  jwtSecret: process.env.JWT_SEC,

  // Model validations
  validations // :validations
};
