const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

exports.encrypt = async (Password) => {
    try {
        const salt = await bcrypt.genSalt(10); //It's represent 10 layer of encryption
        const hashpassword = await bcrypt.hash(Password, salt);
        return hashpassword;
    } catch (err) {

    }
}

exports.compare = async (ExistingPassword, DBPassword) => {
    try {
        const isMatch = await bcrypt.compare(ExistingPassword, DBPassword); //It's compare user request password and existing                                                                         //database passwprd
        if (isMatch)
            return true;
        else
            return false;
    } catch (err) {

    }
}

exports.verifyToken = async (token) => {
    try {
        const CustId = jwt.verify(token, process.env.JWT_SECRETKEY);
        if (CustId)
            return CustId;
        else
            return false
    } catch (err) {

    }
}

exports.generateToken = async (customerId) => {
    try {
        const token = jwt.sign({ CustId: customerId }, process.env.JWT_SECRETKEY, { expiresIn: '5d' });
        return token;
    } catch (err) {

    }
}
