const winston = require('winston');
const logger = require('../../main/common/logger');
// const mongo = require('mongodb');

const fromHours = -24 * 7; // Default to a week back (Winston query will default to 24 hours)

exports.list = function (req, res, next) {

  // https://github.com/winstonjs/winston#querying-logs
  var limit = parseInt(req.query['limit'], 10) || 100;
  var start = parseInt(req.query['start'], 10) || 0;
  var order = parseInt(req.query['order'], 10) || 'desc'
  const options = {
    start,
    limit,
    order
    // fields: ['message', 'level'],
    // type: 'console'
    // type: 'mongodb'
  };

  const fields = typeof req.query['fields'] == 'string' ? req.param('fields') : null;
  if (fields) options.fields = fields.split(',');

  const from = req.query['from'] ? new Date(req.param('from')) : new Date().setHours(fromHours);
  if (from) options.from = from;

  const until = req.query['until'] ? new Date(req.param('until')) : null;
  if (until) options.until = until;

  logger.transports.mongodb.query(options, function (err, results) {
    if (err) {
      logger.error(err);
      return res.status(500).json({ success: false, errors: [err.message] });
    }

    return res.json({ success: true, data: results });
  });

};
