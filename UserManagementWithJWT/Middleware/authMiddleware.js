const { mssql, config } = require('../DataBase/dbConfiguration');
const utilities = require('../Utilities/utils');

const checkCustomerAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            // Get token from headers
            const token = authorization.split(' ')[1];
            if (token) {
                // Verify token
                const { CustId } = await utilities.verifyToken(token);
                if (typeof CustId != undefined) {
                    // Verify customer from database that extract from token above
                    let pool = await mssql.connect(config);
                    await pool.request()
                        .input('authuserId', mssql.Int, CustId)
                        .execute('getAuthCustomer', async (err, response) => {
                            if (err) {
                                res.status(500).send({
                                    error: 'Unauthorize customer',
                                    errorDetails: err.message,
                                    status: 'failed',
                                    statusCode: '500'
                                });
                            } else {
                                if (response.recordset.length > 0 && response.recordset.length === 1) {
                                    let dbCustId = response.recordset[0]['CustId'];
                                    req.CustId = dbCustId;
                                    next();
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
                    res.status(500).send({
                        error: 'Unauthorize customer, check provide token',
                        status: 'failed',
                        statusCode: '500'
                    });
                }
            } else {
                res.status(500).send({
                    error: 'Unauthorize customer, No token',
                    status: 'failed',
                    statusCode: '500'
                });
            }
        } catch (err) {
            res.status(500).send({
                error: 'Unauthorize customer',
                errorDetails: err.message,
                status: 'failed',
                statusCode: '500'
            });
        }
    } else {
        res.status(500).send({
            error: 'Unauthorize customer, No token',
            status: 'failed',
            statusCode: '500'
        });
    }
}

module.exports = { checkCustomerAuth}