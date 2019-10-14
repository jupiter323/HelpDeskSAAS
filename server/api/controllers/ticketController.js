const Ticket = require('mongoose').model('Ticket');
const logger = require('../../main/common/logger');
const User = require('mongoose').model('User');
var { sendEmail } = require('../../main/common/utils')
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

// GET /api/tickets/:id
exports.find = function (req, res, next) {

    Ticket.findById(req.params.id, (err, ticket) => {
      if (err || !ticket) {
        if (err) logger.error(err);
        return res.status(404).json({
          success: false,
          errors: [err ? err.message : `ticket id '${req.params.id} not found'`]
        });
      }
  
      return res.json({
        success: true,
        data: ticket
      });
    });
  };


// POST /api/tickets
// Add new ticket
exports.new = function (req, res, next) {
    if (!req.body.ticket || typeof req.body.ticket !== 'object') {
        return res.status(409).json({ success: false, errors: ['\'ticket\' param is required'] });
    }
    var user = req.user;
    var messages = [req.body.ticket.message]
    var ticket = {
        ...req.body.ticket,
        messages,
        startBy: user._id,
        company: user.company
    }
    const newTicket = new Ticket(ticket);
    newTicket.save((err, ticket) => {
        if (err) {
            logger.error(err);
            return res.json({ success: false, errors: [err.message] });
        }
        var subject = `ticket number ${ticket._id}`

        //send email part
        sendEmail(user.email, subject, '<strong>Created new ticket</strong>') //to customer
        User.find({ company: user.company, role: "Admin" }, (err, admins) => { // to client
            if (err) {
                logger.error(err);
            }
            sendEmail(admins[0].email, subject, '<strong>Created new ticket</strong>') //to customer            
        })

        return res.json({ success: true });


    });

};

// DELETE /api/tickets/:id
exports.destroy = (req, res, next) => {
    Ticket.findByIdAndRemove(req.params.id, (err, ticket) => {
        if (err || !ticket) {
            if (err) logger.error(err);
            return res.status(404).json({
                success: false,
                errors: [err ? err.message : `ticket id '${req.params.id} not found'`]
            });
        }

        return res.json({
            success: true,
            data: ticket
        });
    })
};


