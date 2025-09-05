// import packages
const dotenv = require('dotenv').config();
const express = require('express');
const { dbConnect }= require('./configs/db');
const cors = require('cors');
const { corsOptions } = require('./middlewares/cors.Middleware');


const app = express();

// import database
dbConnect();

// import routers
const userRegisterRouter = require('./routes/user.Route');
const playRouter = require('./routes/play.Route');

// middleware
app.use(express.json());
app.use(cors(corsOptions));

// router use
app.use(process.env.USER_ROUTES, userRegisterRouter);
app.use('/vlms/play', playRouter);

// server listen
app.listen(process.env.PORT, ()=>{
    console.log(`The server is running on port : ${process.env.PORT}`);
})