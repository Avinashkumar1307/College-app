const express = require('express');
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const ejs = require("ejs");
const path = require("path");
const { ClientRequest } = require('http');
const { profile } = require('console');


const app = express();
app.set("view engine", "ejs");
app.use(session(
    {
        secret: "key",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    }
));


app.use(passport.initialize());
app.use(passport.session());


passport.use(new GoogleStrategy({
    clientID: "471138381134-nkmu9j3h71bb97oeq83suq59h7p3qven.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3000/auth/google/callback"
}, function (accessToken, refreshToken, profile,cb ) {
    cb(null, profile);
}));


passport.serializeUser(function (user, cb) {
    cb(null, user);
})
passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
})



app.use(express.static(path.join(__dirname, "public")));


app.get("/login", (req, res) => {
    res.render(path.join(__dirname, "login.ejs"))

});

app.listen(3000, () => {
    console.log("start");
})


app.get("/auth/google", passport.authenticate("google",
    { scope: ["profile", "email"] })
);


app.get("/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/login"
    }),
    (req, res) => {
        res.redirect("/dashboard");
    }
);

app.get("/dashboard", (req, res) => {
    if (req.isAuthenticated()) {
        console.log("AA gya hu");
        res.render(path.join(__dirname, "/dashboard.ejs"), {
            user: req.user
        });
    } else {
        res.redirect("/login.ejs");
    }
})

