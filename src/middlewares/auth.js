const jwt = require("jsonwebtoken");
const { User } = require("../models/collections");
require("../db/connection");

const auth = async (req, res, next)=>{
    try {
        const
        //requesting the cookies and verifying the requested token::
        token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        
        //checking if the token recieved from cookies is same as the one in our database:
        const user = await User.findOne({user_id : verifyUser.user_id});
        next();
    } catch (error) {
        res.status(401).render("error");
    }
};


//Exporting::

module.exports = auth; 