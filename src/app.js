const express = require("express");
const app = express();
require("./db/conn");
const hbs = require("hbs");
const Register = require("./models/registers")

const port = process.env.PORT || 8000
const path = require("path");

const static_Path = path.join(__dirname, "../public")
const template_Path = path.join(__dirname, "./templates/views")
const partials_Path = path.join(__dirname, "./templates/partials")

app.use(express.json())
app.use(express.urlencoded({extended:false}))

// app.use(express.static(static_Path));
app.set("view engine", "hbs");
app.set("views", template_Path);
hbs.registerPartials(partials_Path);

app.get("/", async(req, res)=>{
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
            const registered = await registerEmployee.save();
            res.status(201).send(registered)
        }else{
            res.status(400).send("Password are not matching")
        }


        // console.log(req.body.firstname);
        // console.log(req.body.lastname);
        // console.log(req.body.email);
        // console.log(req.body.gender);
        // res.send(req.body.gender)
    } catch (error) {
        res.status(400).send(error
            )
    }
})

app.listen(port, ()=>{
    console.log(`i am listing on ${port}`);
})