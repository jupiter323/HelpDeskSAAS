const Ticket = require('mongoose').model('Ticket');
const logger = require('../../main/common/logger');
// GET /api/tickets
// List tickets, paginations options
exports.list = function (req, res, next) {

    var limit = parseInt(req.query['limit'], 10);
    const pageOptions = {
        page: req.query['page'] || 1,
        limit: limit || 1000,
        sort: req.query['sort'] || 'name asc'
    };

    let filterOptions = {};
    if (req.query['filter']) {
        try {
            const filterParam = JSON.parse(req.query['filter']);
            if (Array.isArray(filterParam) && filterParam.length > 0) {
                filterParam.forEach((item) => {
                    filterOptions[item.id] = new RegExp(item.value, 'i');
                });
            }
        } catch (err) {
            logger.warn('Could not parse \'filter\' param ' + err);
        }
    }

    Ticket.paginate(filterOptions, pageOptions, (err, result) => {
        if (err) {
            logger.error(err);
            return res.status(500).json({
                success: false,
                errors: [JSON.stringify(err)]
            });
        }

        result.success = true;
        return res.json(result);
    });
};

// POST /api/tickets
// Add new ticket
exports.new = function (req, res, next) {
    if (!req.body.ticket || typeof req.body.ticket !== 'object') {
        return res.status(409).json({ success: false, errors: ['\'ticket\' param is required'] });
    }
    var ticket = req.body.ticket;
    const newTicket = new Ticket(ticket);
    newTicket.save((err) => {
        if (err) {
            logger.error(err);
            return res.json({ success: false, errors: [err.message] });
        }

        return res.json({ success: true });
    });

};


