const express = require('express');
const app = express();
require('dotenv').config();
const port=process.env.PORT ||4000;

app.use(express.json());

require("./config/database").connect();

// routes

const user=require("./routes/user")
app.use("/api/v1",user);  

app.listen(port,()=>{
      console.log("server started");
})