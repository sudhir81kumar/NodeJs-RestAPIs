const User = require("../Model/User");
const userService = require("../Services/userServices");
const utils = require("../Utility/utils");

const SaveUser = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Payload body can not be empty"
        });
    } else {
        // Create object for user payload
        const user = {
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            Email: req.body.Email,
            Age: req.body.Age,
            Department: req.body.Department,
            CreatedDate: utils.dateTime(),
            IsActive: req.body.IsActive
        };

        // Save user data in the database
        userService.saveUser(user, (err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the user."
                });
            else
                res.send(data);
        });
    };
}

const GetById = (req, res) => {
    userService.getById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `User not found with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error occur for user id " + req.params.id
                });
            }
        } else res.send(data);
    });
}

const GetUser = (req, res) => {
    const firstname = req.query.firstname;

    userService.getUsers(firstname, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Error occurred while retrieving user."
            });
        else res.send(data);
    });
};

const UpdateUser = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Payload body can't be empty!"
        });
    } else {
        console.log(req.body);

        // Create object for user payload
        const user = {
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            Department: req.body.Department,
            IsActive: req.body.IsActive
        };

        userService.updateUser(
            req.params.id, user, (err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `User not found for id ${req.params.id}.`
                        });
                    } else {
                        res.status(500).send({
                            message: "Error updating Tutorial with id " + req.params.id
                        });
                    }
                } else res.send(data);
            }
        );
    }
};

const DeleteUser = (req, res) => {
    userService.deleteUser(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `User not found with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error occur while deleting user with id : " + req.params.id
                });
            }
        } else res.send({ message: `User deleted successfully with user id : ${req.params.id}` });
    });
};

module.exports = {
    SaveUser,
    GetById,
    GetUser,
    UpdateUser,
    DeleteUser
}