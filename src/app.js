require('dotenv').config()
const express = require("express");
const app = express();
require("./db/conn");
const hbs = require("hbs");
// const Register = require("./models/registers")
const employeeRouter = require("./routers/employee")
// const bcrypt = require("bcrypt")
// const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser")
// const auth = require("./middleware/auth")

const port = process.env.PORT || 8000
const path = require("path");

const static_Path = path.join(__dirname, "../public")
const template_Path = path.join(__dirname, "./templates/views")
const partials_Path = path.join(__dirname, "./templates/partials")

app.use(express.static(static_Path));

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(employeeRouter)

app.use(express.static(static_Path));
app.set("view engine", "hbs");
app.set("views", template_Path);
hbs.registerPartials(partials_Path);

app.listen(port, ()=>{
    console.log(`i am listing on ${port}`);
})