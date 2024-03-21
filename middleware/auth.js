
// auth,isStudent ,isAdmin


const jwt=require('jsonwebtoken');
require("dotenv").config();

exports.auth=(req,res)=>{
      try{

            //jwt token extract
            // other way to fetch token pending
            const token=req.body.token||req.cookies.token
            if(!token){
                  return res.status(401).json({
                        success: false,
                        message:"token missing"
                  })
            }

            // verify token

            try{
                 const payload=jwt.verify(token,process.env.JWT_SECRET);
                 console.log(payload);
                 
                 request.user=payload;
            }
            catch(err){
                  return res.status(401).json({
                        success: false,
                        message:"token not valid"
                  })
            }

            next();

      }catch(err){
            return res.status(401).json({
                  success: false,
                  message:"something went wrong while verifying token"
            })
      }
}


exports.isStudent=(req,res)=>{
      try{
            if(req.user.role!=="Student"){
                  return res.status(401).json({
                        success: false,
                        message:"this is a protected route for students"
                  })
            }

            next();
      }
      catch(err){
            return res.status(500).json({
                  success: false,
                  message:"user role is not matching"
            })
      }
}


exports.isAdmin=(req,res)=>{
      try{
            if(req.user.role!=="Admin"){
                  return res.status(401).json({
                        success: false,
                        message:"this is a protected route for Admin"
                  })
            }

            next();
      }
      catch(err){
            return res.status(500).json({
                  success: false,
                  message:"user role is not matching"
            })
      }
}

