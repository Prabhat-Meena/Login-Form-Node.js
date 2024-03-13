const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required:true,
    },
    lastname: {
        type: String,
        required:true,
    },
    email: {
        type: String,
        required: true,
        unique:[true, "Email id alread present"],
    },
    gender: {
        type: String,
        required:true,
    },
    phone: {
        type : Number,
        min : 10,
        required : true,
        unique : true
    },
    age: {
        type : Number,
        required : true,
    },
    password: {
        type: String,
        required:true,
    },
    confirmpassword: {
        type: String,
        required:true,
    },
    tokens : [{
        token : {
            type : String,
            required: true
        }
    }]
})

//genrating token here

employeeSchema.methods.generateAuthToken = async function(next){
    try {
        // console.log(this._id)
        const token = jwt.sign({_id:this._id}, process.env.SECRET_KEY)
        // console.log(token);
        //isme tokens jo hai bo bo schema ka field hai jisko schema ke tokens ke andr bale token se concate karenge or fir jo token genrate hua hai usko usse ko concate kr denge this.tokens.concat(token->ye jo hai field ken andr bala hai : token-> ye jo hai hamne genrate kya hai bo hai)
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        console.log("not generated", + error);
    }
}


//here i am hashing my password
employeeSchema.pre("save", async function(next){
    // isModified() se password tabhi hash hoga yadi kisi ne password field me change kya hai tb!
    if(this.isModified("password")){
        // console.log(this.password);
        this.password = await bcrypt.hash(this.password, 10)
        // console.log(this.password);
        // this.confirmpassword = undefined;
        this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);

    }
    // console.log("hello");
    //agar next() ko call nhi karenge to pre meddileware  hamesa load hi hota rahega
    next();
})
// defining model
const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;