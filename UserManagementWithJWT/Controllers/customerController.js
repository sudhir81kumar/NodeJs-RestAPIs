const { mssql, config } = require('../DataBase/dbConfiguration');
const utilities = require('../Utilities/utils');
const transporter = require('../Email/emailConfig');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const Registration = async (req, res) => {
    try {
        const { Name, Email, Mobile, Age, City, Password, TC, isActive } = req.body;
        // Case-1: Check mandatory fields before inserting
        if (Name != '' && Email != '' && Mobile != '' && Password != '') {
            // Case-2: Check unique email and moble before inserting to database using out parameter
            let pool = await mssql.connect(config);
            await pool.request()
                .input('Name', mssql.VarChar(50), Name)
                .input('Email', mssql.VarChar(50), Email)
                .input('MobileNo', mssql.VarChar(50), Mobile)
                .input('Age', mssql.Int, Age)
                .input('City', mssql.VarChar(100), City)
                .input('Password', mssql.VarChar(1000), await utilities.encrypt(Password))
                .input('TC', mssql.Bit, TC)
                .input('isActive', mssql.Bit, isActive)
                .output('status', mssql.Int)
                .execute('CustRegistration', (err, response) => {
                    if (err) {
                        res.status(201).send({
                            error: 'error ocuur while save customer details',
                            errorDetails: err.message,
                            status: 'faild',
                            statusCode: '201'
                        });
                    } else {
                        if (response.output.status === 1) {
                            res.status(400).send({
                                msg: 'customer already exist',
                                status: 'failed',
                                statusCode: '400'
                            });
                        } else {
                            res.status(200).send({
                                msg: 'customer created successfully ',
                                status: 'success',
                                statusCode: '200'
                            });
                        }
                    }
                });
        } else {
            res.status(400).send({
                msg: 'name, email, mobile, password are required',
                status: 'faild',
                statusCode: '400'
            });
        }
    } catch (err) {
        res.status(500).send({
            error: 'error ocuur while fetching customer details',
            errorDetails: err.message,
            status: 'faild',
            statusCode: 500
        });
    }
}

const Login = async (req, res) => {
    try {
        const { email, mobile, password } = req.body;
        if (email && mobile && password) {
            let pool = await mssql.connect(config);
            await pool.request()
                .input('Id', mssql.Int, 0)
                .input('email', mssql.VarChar(50), email)
                .execute('getCustomerDetails', async (err, response) => {
                    if (err) {
                        res.status(500).send({
                            error: 'error ocuur while login',
                            errorDetails: err.message,
                            status: 'failed',
                            statusCode: '500'
                        });
                    } else {
                        if (response.recordset.length > 0 && response.recordset.length === 1) {
                            let dbpassword = response.recordset[0]['Password'];
                            let dbmobile = response.recordset[0]['MobileNo'];
                            let customerId = response.recordset[0]['CustId'];
                            const isMatchPassword = await utilities.compare(password, dbpassword);
                            if ((mobile === dbmobile) && isMatchPassword) {
                                const token = await utilities.generateToken(customerId);
                                res.status(200).send({
                                    msg: 'customer login successfully',
                                    token: token,
                                    status: 'success',
                                    statusCode: '200'
                                });
                            } else {
                                res.status(400).send({
                                    msg: 'invalid customer',
                                    status: 'failed',
                                    statusCode: '400'
                                });
                            }
                        } else {
                            res.status(400).send({
                                msg: 'customer not registred',
                                status: 'failed',
                                statusCode: '400'
                            });
                        }
                    }
                });
        } else {
            res.status(400).send({
                msg: 'email, mobile, password are required',
                status: 'failed',
                statusCode: '400'
            });
        }
    } catch (err) {
        res.status(500).send({
            error: 'error ocuur while customer login',
            errorDetails: err.message,
            status: 'failed',
            statusCode: 500
        });
    }
}

const ChangePassword = async (req, res) => {
    try {
        const { email, password, cnf_password } = req.body;
        if (email && password && cnf_password) {
            if (password === cnf_password) {
                let saltPassword = await await utilities.encrypt(password);
                let pool = await mssql.connect(config);
                await pool.request()
                    .input('CustId', mssql.Int, req.CustId)
                    .input('email', mssql.VarChar(50), email)
                    .input('password', mssql.VarChar(1000), saltPassword)
                    .execute('ChangePassword', async (err, response) => {
                        if (err) {
                            res.status(500).send({
                                error: 'error ocuur while change password',
                                errorDetails: err.message,
                                status: 'failed',
                                statusCode: '500'
                            });
                        } else {
                            if (response.rowsAffected.length > 0 && response.rowsAffected.length === 1) {
                                res.status(200).send({
                                    msg: 'password changed successfully',
                                    status: 'success',
                                    statusCode: '200'
                                });
                            } else {
                                res.status(400).send({
                                    msg: 'error occur while password changed',
                                    status: 'failed',
                                    statusCode: '400'
                                });
                            }
                        }
                    });
            } else {
                res.status(400).send({
                    msg: 'password and conform_password doesnot match',
                    status: 'failed',
                    statusCode: '400'
                });
            }
        } else {
            res.status(400).send({
                msg: 'email, password, conform_password are required',
                status: 'failed',
                statusCode: '400'
            });
        }
    } catch (err) {
        res.status(500).send({
            error: 'error occur while password changed',
            errorDetails: err.message,
            status: 'failed',
            statusCode: 500
        });
    }
}

const GetProfile = async (req, res) => {
    try {
        let pool = await mssql.connect(config);
        await pool.request()
            .input('CustomerId', mssql.Int, req.CustId)
            .execute('getCustomerProfile', async (err, response) => {
                if (err) {
                    res.status(500).send({
                        error: 'error ocuur while feching customer profile',
                        errorDetails: err.message,
                        status: 'failed',
                        statusCode: '500'
                    });
                } else {
                    if (response.recordset.length > 0) {
                        res.status(200).send({
                            data: response.recordset,
                            msg: 'profile fetching successfully',
                            status: 'success',
                            statusCode: '200'
                        });
                    } else {
                        res.status(400).send({
                            msg: 'no profile of existing custome',
                            status: 'failed',
                            statusCode: '400'
                        });
                    }
                }
            });
    } catch (err) {
        res.status(500).send({
            error: 'error occur while feching customer profile',
            errorDetails: err.message,
            status: 'failed',
            statusCode: 500
        });
    }
}

const SendEmailToResetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (email) {
            let pool = await mssql.connect(config);
            await pool.request()
                .input('Id', mssql.Int, 0)
                .input('email', mssql.VarChar(50), email)
                .execute('getCustomerDetails', async (err, response) => {
                    if (err) {
                        res.status(500).send({
                            error: 'error ocuur while getting email',
                            errorDetails: err.message,
                            status: 'failed',
                            statusCode: '500'
                        });
                    } else {
                        if (response.recordset.length > 0 && response.recordset.length === 1) {
                            let customerId = response.recordset[0]['CustId'];
                            let userEmail = response.recordset[0]['Email'];
                            const secretKey = customerId + process.env.JWT_SECRETKEY;
                            const token = jwt.sign({ CustId: customerId }, secretKey, { expiresIn: '15m' });
                            // This url http://127.0.0.1:3000/api/customer/reset/${customerId}/${token} will fontend page url 
                            const verifyLink = `http://127.0.0.1:3000/user/resetpassword/${customerId}/${token}`;
                            // Here will write code for send email
                            console.log(verifyLink);
                            // let info = await transporter.sendMail({
                            //     from: process.env.EMAIL_FROM,
                            //     to: userEmail,
                            //     subject: "Password reset link",
                            //     html: `<a href=${verifyLink}>Click Here</a> to verify your password reset`
                            // });
                            res.status(200).send({
                                msg: 'Verify link send to your registred email to reset password',
                                status: 'success',
                                statusCode: '200'
                            });
                        } else {
                            res.status(400).send({
                                msg: 'email does not exist',
                                status: 'failed',
                                statusCode: '400'
                            });
                        }
                    }
                });
        } else {
            res.status(400).send({
                msg: 'email are required',
                status: 'failed',
                statusCode: '400'
            });
        }
    } catch (err) {
        res.status(500).send({
            error: 'error occur while password changed',
            errorDetails: err.message,
            status: 'failed',
            statusCode: 500
        });
    }
}

const UpdatePasswordOnLinkVerify = async (req, res) => {
    try {
        const { password, cnf_password } = req.body;
        const { id, token } = req.params; // This will get value from url that;s use in routes
        if (password && cnf_password) {
            if (password === cnf_password) {
                let pool = await mssql.connect(config);
                await pool.request()
                    .input('Id', mssql.Int, id)
                    .input('email', mssql.VarChar(50), '')
                    .execute('getCustomerDetails', async (err, response) => {
                        if (err) {
                            res.status(500).send({
                                error: 'error ocuur while getting password details',
                                errorDetails: err.message,
                                status: 'failed',
                                statusCode: '500'
                            });
                        } else {
                            if (response.recordset.length > 0 && response.recordset.length === 1) {
                                let customerId = response.recordset[0]['CustId'];
                                const new_token = customerId + process.env.JWT_SECRETKEY;
                                jwt.verify(token, new_token);  //Verify coming token and existing token
                                // and if user verifyed then salt the password and update it in database

                                const salt = await bcrypt.genSalt(10);
                                const newhashPassword = await bcrypt.hash(password, salt);
                                let pool = await mssql.connect(config);
                                await pool.request()
                                    .input('CustId', mssql.Int, customerId)
                                    .input('password', mssql.VarChar(1000), newhashPassword)
                                    .execute('ResetPassword', async (err, response) => {
                                        if (err) {
                                            res.status(500).send({
                                                error: 'error ocuur while updating password',
                                                errorDetails: err.message,
                                                status: 'failed',
                                                statusCode: '500'
                                            });
                                        } else {
                                            if (response.rowsAffected.length > 0 && response.rowsAffected.length === 1) {
                                                res.status(200).send({
                                                    msg: 'password reset successfully',
                                                    status: 'success',
                                                    statusCode: '200'
                                                });
                                            } else {
                                                res.status(400).send({
                                                    msg: 'no record found for user',
                                                    status: 'failed',
                                                    statusCode: '400'
                                                });
                                            }
                                        }
                                    });
                            } else {
                                res.status(400).send({
                                    msg: 'email, password and cnf-password does not exist',
                                    status: 'failed',
                                    statusCode: '400'
                                });
                            }
                        }
                    });
            } else {
                res.status(400).send({
                    msg: 'password and conform_password doesnot match',
                    status: 'failed',
                    statusCode: '400'
                });
            }
        } else {
            res.status(400).send({
                msg: 'password, conform_password are required',
                status: 'failed',
                statusCode: '400'
            });
        }
    } catch (err) {
        res.status(500).send({
            error: 'error occur while password changed',
            errorDetails: err.message,
            status: 'failed',
            statusCode: 500
        });
    }
}

module.exports = {
    Registration,
    Login,
    ChangePassword,
    GetProfile,
    SendEmailToResetPassword,
    UpdatePasswordOnLinkVerify
}