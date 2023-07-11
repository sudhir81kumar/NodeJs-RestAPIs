const mysql = require("../DataBase/userDB");

// const saveUser = (newUser, result) => {
//     mysql.query("INSERT INTO Persons SET ?", newUser, (err, res) => {
//         if (err) {
//             console.log("error: ", err);
//             result(err, null);
//             return;
//         }

//         console.log("created users: ", { id: res.insertId, ...newUser });
//         result(null, { id: res.insertId, ...newUser });
//     });
// }

const saveUser = (newUser, result) => {
    var sqlquery = 'call AddUser(?,?,?,?,?,?,?)'
    mysql.query(sqlquery, [newUser.FirstName, newUser.LastName,newUser.Email,newUser.Age,newUser.Department,newUser.CreatedDate,newUser.IsActive], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created users: ", { id: res.insertId, ...newUser });
        result(null, { id: res.insertId, ...newUser });
    });
}

const getById = (id, result) => {
    mysql.query(`SELECT * FROM Persons WHERE Personid = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        } else {

            if (res.length) {
                console.log("found Users: ", res[0]);
                result(null, res[0]);
                return;
            } else {
                //If not found user with the id
                result({ kind: "not_found" }, null);
            }
        }
    });
}

const getUsers = (fName, result) => {
    let query = "SELECT * FROM Persons";

    if (fName) {
        query += ` WHERE FirstName LIKE '%${fName}%'`;
    }

    mysql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } else {

            console.log("Users: ", res);
            result(null, res);
        }
    });
};

const updateUser = (id, newUser, result) => {
    mysql.query("UPDATE Persons SET FirstName = ?, LastName = ?, Department = ?, IsActive = ? WHERE Personid = ?",
        [newUser.FirstName, newUser.LastName, newUser.Department, newUser.IsActive, id], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            } else {
                if (res.affectedRows == 0) {
                    // not found users with the id
                    result({ kind: "not_found" }, null);
                    return;
                } else {
                    console.log("User updated: ", { id: id, ...newUser });
                    result(null, { id: id, ...newUser });
                }
            }
        }
    );
};

const deleteUser = (id, result) => {
    mysql.query("DELETE FROM Persons WHERE Personid = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } else {
            if (res.affectedRows == 0) {
                // not found Tutorial with the id
                result({ kind: "not_found" }, null);
                return;
            } else {
                console.log("User deleted successfully with user id: ", id);
                result(null, res);
            }
        }
    });
};

module.exports = {
    saveUser,
    getById,
    getUsers,
    updateUser,
    deleteUser
}