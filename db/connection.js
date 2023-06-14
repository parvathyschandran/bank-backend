//define node app and mongodb database connectivity


//import mongoose in connection .js file
const mongoose = require('mongoose')
//get connection string from .env file to connection.js file - process.env
const connectionString = process.env.DATABASE
//connect the node app with  mongodb using connection string with help of mongoose
mongoose.connect(connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log('mongodb atlas connected successfully');
}).catch(() => {
    console.log("mongodb connection error: " +error);
})