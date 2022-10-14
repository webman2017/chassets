const express = require('express');
const { registerView, loginView, dashboardView, quotationView } = require('../controllers/loginController');
const router = express.Router();
router.get('/register', registerView);
router.get('/login', loginView);
router.get('/dashboard', dashboardView);
router.get('/quotation', quotationView);
module.exports = router;