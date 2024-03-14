const mongoose  = require("mongoose");

// connecting node to mmongoDB using mongoose 

mongoose.connect(process.env.DB_HOST)
.then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
})