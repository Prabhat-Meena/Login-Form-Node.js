const mongoose  = require("mongoose");
const Secret_Key = require("../../secret")
mongoose.connect(Secret_Key)
.then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
})