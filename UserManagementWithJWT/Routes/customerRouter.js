const express = require('express');
const customerController = require('../Controllers/customerController');
const checkAuth = require('../Middleware/authMiddleware');


const router = express.Router();

// Route lavel middileware for protected routes
router.use('/changepassword', checkAuth.checkCustomerAuth)
router.use('/userprofile', checkAuth.checkCustomerAuth)

// Public routes
router.post('/registration', customerController.Registration);
router.post('/login', customerController.Login);
// this will call user reset password when he have email id and send verify link on registered email id
router.post('/send-reset-password-email', customerController.SendEmailToResetPassword); 
// this will call when user click on email receive link 
router.post('/reset-password/:id/:token', customerController.UpdatePasswordOnLinkVerify);

// Protected routes
router.post('/changepassword', customerController.ChangePassword);
router.get('/userprofile', customerController.GetProfile);

module.exports = { router }