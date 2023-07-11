const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const customerRoutes = require('./Routes/customerRouter');
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public Routes
app.use('/api/user', customerRoutes.router);

// Protected Routes


app.listen(process.env.APP_PORT, (err, resp) => {
    if (err) {
        resp.status(500).send({
            'message': err.message || 'error ocuur while connecting to server'
        })
    } else {
        console.log(`server has been started at http://localhost:${process.env.APP_PORT}`);
    }
});