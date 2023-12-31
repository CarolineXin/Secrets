//jshint esversion:6
require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true}).then(() => {   console.log("Connected to database."); }).catch((err) => {   console.log("Not connected to database.");   console.log(err); });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET_KEY, encryptedFields: ['password']  });

const User = new mongoose.model("User",userSchema);

app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save()
    .then(function(){
        res.render("secrets");
    })
    .catch(function(err){
        console.error(err);
    });
});

app.post('/login', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
 
    User.findOne({ email: username })
        .then((foundUser) => {
            if (foundUser && foundUser.password === password) {
                res.render('secrets');
            };
        })
        .catch((error) => {
            console.log(error);
            res.send(400, 'Bad request');
        })
});

app.listen(3000, function(){
    console.log("Server started on the port 3000.")
});