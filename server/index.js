"use strict";

const express = require("express");
const morgan = require('morgan');
const cors = require('cors');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const userController = require("./controllers/users_controller");

const PORT = 3001;
const API_PREFIX = '/api/v1';
const app = new express();

/* CORS */
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

/* HTTP logger middleware */
app.use(morgan("combined"));

/* JSON */
app.use(express.json());

/* AUTHENTICATION */
app.use(session({
    secret: 'a very different random secret string',
    resave: false,
    saveUninitialized: false
}));

passport.use(new LocalStrategy(function verify(username, password, callback) {
    userController.login(username, password)
        .then((result) => {
            return callback(null, result);
        })
        .catch(() => {
            return callback(null, false, {
                messsage: 'Wrong username or password'
            });
        });
}));

passport.serializeUser((user, callback) => {
    callback(null, {
        id: user.id,
        usernae: user.username
    });
});

passport.deserializeUser((user, callback) => {
    return callback(null, user);
});

/* Serve Static content */
app.use(express.static(__dirname + '/public'));

/* ROUTES */
const {usersRouter} = require("./routes/users_routes");
const {riddlesRouter} = require("./routes/riddles_routes");
app.use(`${API_PREFIX}/users`, usersRouter);
app.use(`${API_PREFIX}/riddles`, riddlesRouter);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));