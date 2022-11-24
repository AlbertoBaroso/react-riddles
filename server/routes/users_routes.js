'use strict';
const passport = require('passport');
const usersRouter = require('express').Router();
const usersController = require('../controllers/users_controller');

/* Middleware to check if user is authenticated */
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    return res.sendStatus(400);
}

/* Login */
usersRouter.post('/login', passport.authenticate('local'), async (req, res) => { 
    res.send({});
});

/* Logout */
usersRouter.delete('/logout', passport.authenticate('session'), (req, res) => {
    req.logout(() => {
        res.send({});
    });
});

/* Get top 3 users */
usersRouter.get('/top3', async (req, res) => {
    try {
        const topThree = await usersController.getTop3Scores();
        res.status(200).send(topThree);
    } catch (exception) {
        res.sendStatus(500);
    }
});


module.exports = {
    usersRouter,
    isLoggedIn,
};