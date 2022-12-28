const bcrypt = require('bcrypt')
const User = require('../modal/user')
const jwt = require('jsonwebtoken');

module.exports={
    login:async(req,res)=>{
        try {
            let user = await User.findOne({ email: req.body.email })
            if (!user || user.verified==false) {
                console.log("No user");
                res.status(200).json({ message: "Invalid Email" })
            }else if(user.isBlock==true){
                res.status(200).json({ message: "This account has been blocked" })
            }else{
            const hashPassword = await bcrypt.compare(req.body.password, user.password)
            if (hashPassword) {
                let id = user._id
                console.log(process.env.JWTSECRET);
                const token = jwt.sign({ id }, process.env.JWTSECRET, {
                    expiresIn: 30000,   
                })
                res.status(200).json({ auth: true, token: token ,userId:id})
            } else {
                console.log("fail");
                res.status(200).json({ message: "Enter Valid Password" })
            }
        }
        } catch (error) {
            console.log(error);
        }
    }
}