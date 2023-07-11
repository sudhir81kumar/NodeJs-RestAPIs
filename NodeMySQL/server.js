const express = require("express");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const userRoute = require("./Router/userRouter");

var corsOrigin = {
    origin: "http://localhost:8081"
};

//enable CORS for all requests
app.use(cors(corsOrigin));
// parse property from .enx file using like process.env.PORT
dotenv.config();
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.status(200).send(`Welcome !! Services is running`);
});

app.use('/api', userRoute.router);

app.listen(process.env.PORT, (req, res) => {
    console.log(`Server has been started on port ${process.env.PORT} for ${process.env.NODE_ENV}`);
});

