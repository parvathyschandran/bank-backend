//router specefic middleware
//import jsonwebtoken
const jwt = require('jsonwebtoken')

//define logic for checking user loginned or not
const logMiddleware = (req, res, next) => {
    console.log("Router specefic middleware");
    //get token
    const token = req.headers['access-token']
    try {
        //verify token
        const { loginAcno } = jwt.verify(token, "supersecretkey12345")
        console.log(loginAcno);
        //pass login acno to rwq
        req.debitAcno = loginAcno
        //to process user request
        next()
    }
    catch {
        res.status(401).json("Please login")
    }
}

module.exports = {
    logMiddleware
}