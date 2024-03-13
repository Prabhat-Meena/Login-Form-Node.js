require('dotenv').config()
const express = require("express");
const app = express();
require("./db/conn");
const hbs = require("hbs");
const Register = require("./models/registers")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser")
const auth = require("./middleware/auth")

const port = process.env.PORT || 8000
const path = require("path");

const static_Path = path.join(__dirname, "../public")
const template_Path = path.join(__dirname, "./templates/views")
const partials_Path = path.join(__dirname, "./templates/partials")

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())

// app.use(express.static(static_Path));
app.set("view engine", "hbs");
app.set("views", template_Path);
hbs.registerPartials(partials_Path);

app.get("/", async(req, res)=>{
    console.log(req.cookies.jwt);
    res.render("index")
})
app.get("/register", async(req, res)=>{
    res.render("register")
})

app.post("/register", async(req, res)=>{
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if(password===cpassword){
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password:password,
                confirmpassword:cpassword
            })
            console.log("before");
            const token = await registerEmployee.generateAuthToken()
            // console.log("token : ", token);
            
            //here we are going to store jwt tokent in cookies
            // res.cookie("name", value, [{optional}])
            // res.cookie("jwt", token, {
            //     expires: new Date.now() + 40000,
            //     // httpOnly set karne se user cookie ko remove nhi kr sakte
            //     httpOnly:true
            // })
            // console.log(cookie);

            const registered = await registerEmployee.save();
            console.log("reg:", registered);
            res.status(201).cookie("jwt", token, {
                // expires: new Date(date.now() + 40000),
                httpOnly:true
            }).send(registered)
        }else{
            res.status(400).send("Password are not matching")
        }


        // console.log(req.body.firstname);
        // console.log(req.body.lastname);
        // console.log(req.body.email);
        // console.log(req.body.gender);
        // res.send(req.body.gender)
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
})

app.get("/login", (req,res)=>{
    res.render("login")
})
app.post("/login", async (req, res)=>{
    try {
        const email = req.body.email
        const password = req.body.password

        const userData = await Register.findOne({email})
        //here i compare our password with hashed password
        const isMatch = await bcrypt.compare(password, userData.password);

        if(isMatch){
            // res.status(200).render("index")
            const token = await userData.generateAuthToken();
            //cookie me jwt token stored
            //isme ek secure property bhi hoti hai jisse cookie sirf https pr hi save hoti hai
            // res.cookie("jwt", token, {
            //     expires: new Date(date.now() + 40000),
            //     // httpOnly set karne se user cookie ko remove nhi kr sakte
            //     httpOnly:true
            // })
            // console.log("token ", token );
            res.status(200).cookie("jwt", token, {
                // expires: new Date(date.now() + 40000),
                httpOnly:true}).send(userData)
    }else{
        res.status(400).send("password is not matching")
    }
    } catch (error) {
        res.status(400).send("invalid details")
    }
    
})

app.get("/logout", auth, async(req, res)=>{
    try {
            ///logout from single device
         // console.log(req.user);
        // req.user.tokens = req.user.tokens.filter((currentElement)=>{
        //     return currentElement.token != req.token;
        // });
        // res.clearCookie("jwt");
        // logout from all devices
        req.user.tokens = []
        console.log("logout successful");
        await req.user.save();
        res.render("login")
    } catch (error) {
        res.status(500).send(error)
    }
})
app.listen(port, ()=>{
    console.log(`i am listing on ${port}`);
})