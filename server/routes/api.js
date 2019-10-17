const express = require('express');
const router = express.Router();
const authCheck = require('../middleware/auth-check');
const Roles = require('../../src/shared/roles');

const messageController = require('../api/controllers/messageController');
const userController = require('../api/controllers/userController');
const companyController = require('../api/controllers/companyController');
const ticketController = require('../api/controllers/ticketController');
const logController = require('../api/controllers/logController');
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.png')
    }
});
const upload = multer({ storage: storage })

// GET /api/messages/public1
router.get('/messages/public1', messageController.getPublicMessage1);

// GET /api/messages/private1
router.get('/messages/private1', authCheck(), messageController.getPrivateMessage1);

// GET /api/messages/admin1
router.get('/messages/admin1', authCheck([Roles.admin, Roles.siteAdmin]), messageController.getAdminMessage1);


// GET /api/users
router.get('/users', authCheck([Roles.admin, Roles.siteAdmin]), userController.list);

// GET /api/users/:id
router.get('/users/:id', authCheck([Roles.admin, Roles.siteAdmin]), userController.find);

// PUT /api/users
router.put('/users', authCheck([Roles.admin, Roles.siteAdmin]), userController.updateUser);

// PUT /api/users/password
router.put('/users/password', authCheck([Roles.admin, Roles.siteAdmin]), userController.updatePassword);

// PUT /api/users/profile
router.put('/users/profile', authCheck(), userController.updateProfile);

// PUT /api/users/profile/password
router.put('/users/profile/password', authCheck(), userController.updateProfilePassword);

// DELETE /api/users/:id
router.delete('/users/:id', authCheck([Roles.admin, Roles.siteAdmin]), userController.destroy);


// GET /api/companies
router.get('/companies', authCheck([Roles.siteAdmin]), companyController.list);

// GET /api/companies/:id
router.get('/companies/:id', authCheck([Roles.siteAdmin]), companyController.find);

// GET /api/companies/subdomain/:subdomain
router.get('/companies/subdomain/:subdomain', companyController.findBySubdomain);

// POST /api/companies
router.post('/companies', authCheck([Roles.siteAdmin]), companyController.new);

// PUT /api/companies
router.put('/companies', authCheck([Roles.siteAdmin]), companyController.updateCompany);

// PUT /api/companies/customize
router.put('/companies/customize', authCheck([Roles.siteAdmin, Roles.admin]), companyController.updateCompany);


// DELETE /api/companies/:id
router.delete('/companies/:id', authCheck([Roles.siteAdmin]), companyController.destroy);

// POST /api/companies/uploadlogo
router.post('/companies/uploadlogo', authCheck([Roles.siteAdmin, Roles.admin]), upload.single('file'), companyController.uploadlogo);

// GET /api/companies
router.get('/logs', authCheck([Roles.siteAdmin]), logController.list);

// GET /api/tickets
router.get('/tickets', authCheck(), ticketController.list);

// GET /api/tickets/search
router.get('/tickets/search', ticketController.search);

// GET /api/tickets/:id
router.get('/tickets/:id', authCheck(), ticketController.find);

// GET /api/tickets/:id
router.get('/tickets/search/:id', ticketController.findNAuth);

// POST /api/tickets
router.post('/tickets', authCheck(), ticketController.new);

// POST /api/tickets/email
router.post('/tickets/email', ticketController.newEmail);

// PUT /api/tickets
router.put('/tickets', authCheck(), ticketController.updateTicket);

// DELETE /api/tickets/:id
router.delete('/tickets/:id', authCheck(), ticketController.destroy)
module.exports = router;
