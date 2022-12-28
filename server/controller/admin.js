const Admin = require('../modal/admin')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports={
  register:async(req,res)=>{
    console.log("admin register");
    let admin = await Admin.findOne({email:req.body.email})
    if(admin){
        res.json({message:"Existing email"})
    }else{
        let hashPassword = await bcrypt.hash(req.body.password,10)
        if(hashPassword){
            await new Admin({
                name:req.body.name,
                email:req.body.email,
                password:hashPassword
            }).save()
            res.json({admin:true})
        }else{
            res.json({message:"password Error"})
        }
    }
},

login:async(req,res)=>{
    console.log("xcvbnm,.");
    console.log(req.body);
    let admin =await Admin.findOne({email:req.body.email})
    if(!admin){
        console.log("email false");
        res.json({user:false ,message:"Please enter vlaid email"})
    }else{
        console.log("email true");
        let password =await bcrypt.compare(req.body.password,admin.password)
        if(password){
            console.log(admin);
            let token = await jwt.sign({admin},process.env.JWTSECRET,
                {expiresIn:300})
            res.json({user:true,token:token,message:"Sucess"})
        }else{
            console.log("vbnm,.");
            res.json({user:false ,message:"Not a valid password"})
        }
    }
}
}