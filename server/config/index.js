const validations = require('../../src/shared/model-validations');

module.exports = {

  // DB
  dbUri: 'mongodb://localhost/multi-tenant',
  // dbUri: 'mongodb://admin:Admin!2#4@ds333768.mlab.com:33768/helpdesk',
  

  logging: {
    dbUri: 'mongodb://localhost/multi-tenant-logs'
    // dbUri: 'mongodb://admin:Admin!2#4@ds333768.mlab.com:33768/helpdesklogs'
   
  },

  // jsonwebtoken secret
  jwtSecret: '!!secret phrase!!',

  // Model validations
  validations // :validations
};
