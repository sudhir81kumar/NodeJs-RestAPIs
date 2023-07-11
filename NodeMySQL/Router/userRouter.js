const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");

// Save a new user recode
router.post('/adduser', userController.SaveUser);
// Save a new user recode
router.get('/getuserbyid/:id', userController.GetById);
// Get user by firstName
router.get('/getuser/:firstname', userController.GetUser);
// Get all users
router.get('/getuser', userController.GetUser);
// Update user recode
router.put('/updateuser/:id', userController.UpdateUser);
// Delete user recode by id
router.get('/deleteuser/:id', userController.DeleteUser);

module.exports = {
    router
}