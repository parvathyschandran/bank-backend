//import express
const express = require('express')

//import middleware
const middleware = require('../middleware/routerSpecefic')

//import controller
const userController = require('../controllers/userController')

//create routes,using express.Router() class
const router = new express.Router()



// define routes  to resolve http request 
//register req
router.post('/employee/register', userController.register)
//login request
router.post('/employee/login', userController.login)
//get balance req
router.get(`/user/balance/:acno`, middleware.logMiddleware, userController.getbalance) // ' : ' after this is path parameter
// user/fundtransfer
router.post('/user/transfer', middleware.logMiddleware, userController.transfer)
//mini statement
router.get('/user/ministatement',middleware.logMiddleware,userController.getTransactions)
//delete account
router.delete('/user/delete',middleware.logMiddleware,userController.deleteMyAcno)

//export router
module.exports = router