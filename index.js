//import dotenv
//config : Loads .env file contents into process.env.
// assign these to variable bcz we need to use it again( dotenv is an exception)
require('dotenv').config();
//import express
const express = require('express')
//import cors
const cors = require('cors')
//import db
require('./db/connection')
//import router
const router = require('./Routes/router')

//import appMiddleware
const middleware = require('./middleware/appMiddleware')

//create express server - call that imported express
const server = express()
//setup port number for server
const PORT = 3000 || process.env.PORT

//use cors, json server in server application 
// at first data ie share through cors is json,to parse data parsing needed.order is important.
server.use(cors())
server.use(express.json())
//use appMiddleware
server.use(middleware.appMiddleware)

//before router use middleware

//use router in server app after using json parser
server.use(router)

//to resolve http request using express server
server.get('/',(req,res)=>{
    res.send('Bank server started !!!')
})

//run the server app in a specified port
//to make it running -give callback
server.listen(PORT,()=>{
    console.log(`Bank server started at port number ${PORT}`);
})