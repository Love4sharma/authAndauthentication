const bcrypt = require('bcrypt');
const User=require('../model/User');
const jwt=require('jsonwebtoken');
require("dotenv").config();

// signup route handler


exports.signup = async(req,res)=>{
      try{
            // get data
            const{name,email,password,role}=req.body;

            // check if user exist
            const existingUser = await User.findOne({email});

            if(existingUser){
                  return res.signup(400).json({
                        success:false,
                        message:'User already exists'
                  })
            }

            // secure password

            let hashedpassword;
            try{
                  hashedpassword= await bcrypt.hash(password,10);
            }  
            catch(err){
                  return res.status(500).json({
                        success:false,
                        message:'error in hashing password'
                  })
            }


            // create entry in user

            const user=await User.create({
                  name,email,password:hashedpassword,role
            })
            return res.status(200).json({
                  success:true,
                  message:'User created successfully'
            })
      }
      catch(err){
            console.log(err);
            return res.status(500).json({
                  success:false,
                  message:'User can not be registered try again later'   
            })
      }
}


// login 


exports.login =  async (req,res)=>{
      try{
            // data fetch
            const{email,password} = req.body;
            // validation on email and password
            if(!email||!password){
                  return res.status(400).json({
                        success: false,
                        message:"please fill all the data carefully"
                  })
            }

            // check for registered users
            const user=await User.findOne({email});
            // if not a registered user
            console.log(user);
            if(!user){
                  return res.status(401).json({
                        success: false,
                        message:"user not registered"
                  })
            }


            const payload={
                   email: user.email,
                   id: user.id,
                   role: user.role
            };
             // verify password and generate a jwt token

            if(await bcrypt.compare(password,user.password)){
                  // password match
                  let token =jwt.sign(payload,process.env.JWT_SECRET,{
                        expiresIn:"2h"
                  })
                  user=user.toObject();
                  user.token = token; 
                  user.password =undefined;
                  const options={
                        expires:new Date(Date.now()+3*24*60*60*1000),
                        httpOnly:true
                  }
                  res.cookie("token",token,options).status(200).json({
                        success:true,
                        token,
                        user,
                        message:'user log in successfully'
                  })

            }else{
                  // password do not match
                  return res.status(403).json({
                        success:false,
                        message: 'Password does not match'
                  })    
            }
      }

     

      catch(err){
            console.log(err);
            return res.status(500).json({
                  success:false,
                  message:"login failed"
            })
      }
} 