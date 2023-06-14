//import model in userController.js file
const users = require('../Models/userSchema')

//import jsonwebtoken
const jwt = require('jsonwebtoken')

//define and export logic to resolve different http client request

//register
exports.register = async (req, res) => {
    //testing
    //res.send("register request recieved")

    //register logic
    console.log(req.body);
    //get data send by front end
    const { username, acno, password } = req.body

    if (!username || !acno || !password) {
        //400 series - no output
        res.status(406).json('All inputs are required')
    }
    //check user is an existing user
    try {
        const preuser = await users.findOne({ acno })
        if (preuser) {
            res.status(403).json("User already exist")
        }
        else {
            //add user to db
            const newuser = new users({
                username,
                password,
                acno,
                balance: 5000,
                transactions: []
            })
            //to save newuser in mongodb
            await newuser.save()
            res.status(200).json(newuser)
        }
    }
    catch (error) {
        res.status(401).json(error)
    }
}

//login
exports.login = async (req, res) => {
    //get req body
    const { acno, password } = req.body
    //check acno and password is in db
    try {
        //check acno and password is in db
        const preuser = await users.findOne({ acno, password })
        //check preuser or not
        if (preuser) {
            //generate token using jwt
            const token = jwt.sign({
                loginAcno: acno
            }, "supersecretkey12345")
            //send to client
            res.status(200).json({ preuser, token })
        }
        else {
            res.status(404).json("Invalid account number or password")
        }
    }
    catch (error) {
        res.status(401).json(error)
    }
}

//getbalance
exports.getbalance = async (req, res) => {
    //get acno from path parameter
    let acno = req.params.acno
    //get data of given acno
    try {
        //find acno from users collection
        const preuser = await users.findOne({ acno })
        if (preuser) {
            res.status(200).json(preuser.balance)
        }
        else {
            res.status(404).json("Invalid account number")
        }

    }
    catch {
        res.status(401).json(error)
    }
}

//fund transfer
exports.transfer = async (req, res) => {
    console.log('inside transfer logic');
    //logic
    // 1.get body from req, creditacno, amount, pswd
    const { creditAcno, creditAmount, pswd } = req.body
    //convaert creditAmount to number
    // let amt = Number(creditAmount)
    console.log("credit acno", creditAcno);
    const { debitAcno } = req
    console.log("debit acno", debitAcno)
    //res.send("transfer rst recvd")
    try {
        // 2.check debit acno and pswd available in mongodb
        const debitUserDetails = await users.findOne({ acno: debitAcno, password: pswd })
        console.log(debitUserDetails);
        //3. get credit acno details from mongo db
        const creditUserDetails = await users.findOne({ acno: creditAcno })
        console.log(creditUserDetails);
        //check credit acno is debit acno is same or not - if eual no further procedure
        if (debitAcno != creditAcno) {
            if (debitUserDetails && creditUserDetails) {
                //check sufficient balance available for debitUserDetails
                if (debitUserDetails.balance >= creditAmount) {
                    //perform transfer
                    //debit creditAmount from debitUserDetails
                    debitUserDetails.balance -= creditAmount
                    //add debit transaction to debitUserDetails
                    debitUserDetails.transactions.push({
                        transaction_type: "DEBIT", amount: creditAmount, fromAcno: debitAcno, toAcno: creditAcno
                    })
                    //save debitUserDetails in mongodb
                    await debitUserDetails.save()

                    //credit creditAmount to creditUserDetails
                    creditUserDetails.balance += creditAmount
                    //add debit transaction to creditUserDetails
                    creditUserDetails.transactions.push({
                        transaction_type: "CREDIT", amount: creditAmount, fromAcno: debitAcno, toAcno: creditAcno
                    })
                    //save creditUserDetails in mongodb
                    await creditUserDetails.save()

                    res.status(200).json("Fund Transfer Successful")
                }
                else {
                    res.status(406).json("Insufficient balance")
                }
            }
            else {
                res.status(405).json("Invalid credit or debit details")
            }
        }
        else{
            res.status(406).json("Operation denied..!! Self transaction are not allowed.")
        }
    }
    catch (error) {
        res.status(401).json(error)
    }


}

//get transaction
exports.getTransactions = async (req, res) => {
    //1.get acno from req.debitAcno
    let acno = req.debitAcno
    try {
        //check acno is available in mongodb or not
        const preuser = await users.findOne({ acno })
        res.status(200).json(preuser.transactions)
    }
    catch (error) {
        res.status(401).json(error)
    }
}

//deleteMyAcno
exports.deleteMyAcno = async(req,res)=>{
    //1.get acno from req
    let acno = req.debitAcno
    //remove acno from db
    try{
        const removeItem = await users.deleteOne({acno}) //findByIdAndDelete
        res.status(200).json('Removed successfully')
        //alert res
        //remove login data from local storage
        //redirect to landing page
    }
    catch(error){
        res.status(401).json(error)
    }
}