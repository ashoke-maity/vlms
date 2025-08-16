// import packages
const dotenv = require('dotenv').config();
const express = require('express');
const supabase = require('./configs/db');

const app = express();

// import database
supabase;

// import routers
const userRegisterRouter = require('./routes/user.Route');

// middleware
app.use(express.json());

// router use
app.use(process.env.USER_ROUTES, userRegisterRouter);

// server listen
app.listen(process.env.PORT, ()=>{
    console.log(`The server is running on port : ${process.env.PORT}`);
})