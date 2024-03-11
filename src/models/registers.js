const mongoose = require("mongoose");
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
})

// defining model
const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;