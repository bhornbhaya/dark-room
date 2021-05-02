

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const path = require('path');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//set up session
app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

//initialize passport and set up passport to deal with the session
app.use(passport.initialize());
app.use(passport.session());

//connect to the new database
mongoose.connect("mongodb://localhost:27017/darkUserDB", {useNewUrlParser: true})
mongoose.set("useCreateIndex", true);

//set up new user schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    score: String
});

//set up user schema to use passportLocalMongoose
userSchema.plugin(passportLocalMongoose);
//set up user schema to use findOrCreate function
userSchema.plugin(findOrCreate);

//set up new model
const User = new mongoose.model("User", userSchema);

//passport local configuration
passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/game",
        userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"  },
    function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

app.get('/', function(req, res){
    res.render('home');
});

app.route('/auth/google')
    .get(passport.authenticate('google', {
        scope: ['profile']
    }));

app.get('/auth/google/game',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect to game.
        res.sendFile(path.resolve('public/game.html'));
    });

app.get('/login', function(req, res){
    res.render('login');
});

app.get('/register', function(req, res){
    res.render('register');
});

app.get("/game", function (req, res){
    if(req.isAuthenticated()){
        res.sendFile(path.resolve('public/game.html'));
    } else {
        res.redirect("/login");
    }
})

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

app.get("/tryagain", function (req, res){
    res.sendFile(path.resolve('public/game.html'));
})

app.get("/scoreboard", function(req, res){
    if(req.isAuthenticated()){
        res.render("scoreboard");
    } else {
        res.redirect("/login");
    }


});


app.post("/register", function (req,res){
    User.register({username: req.body.username}, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/register")
        } else {
            passport.authenticate("local")(req, res, function (){
                res.sendFile(path.resolve('public/game.html'));
            })
        }
    })
});

app.post("/login", function (req,res){

    const user = new User({
        username: req.body.username,
        password: req.body.password
    })

    req.login(user, function(err){
        if(err){
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function(){
                res.sendFile(path.resolve('public/game.html'));
            })
        }
    })

    });

app.listen(port, () => console.log(`Server started at port: ${port}`)
);
