'use strict';
const passport = require('passport');
const riddlesRouter = require('express').Router({ mergeParams: true });
const riddlesController = require('../controllers/riddles_controller');
const riddlesDAO = require('../dao/riddles_dao');
const { body, param, validationResult } = require('express-validator');
const { isLoggedIn } = require('../routes/users_routes');
const { beginTransaction, rollbackTransaction, commitTransaction } = require('../database/db');

/**
 * Custom validator function to check exact value of difficulty
 * @param  {string} value - any string
 * @return {boolean} true if difficulty is valid, false otherwise
 */
const difficultyValidator = (value) => {
    const whitelistedDifficulties = ["easy", "average", "hard"];
    if (whitelistedDifficulties.indexOf(value) === -1) {
        throw new Error('Difficulty must be "easy", "average" or "hard"');
    }
    return true;
}

/* Create new riddle */
riddlesRouter.post(
    '/',
    passport.authenticate('session'),
    isLoggedIn,
    body('question').not().isEmpty().trim(),
    body('response').not().isEmpty().trim(),
    body('difficulty').custom(difficultyValidator),
    body('duration').isInt({ min: 30, max: 600 }),
    body('firstHint').not().isEmpty().trim(),
    body('secondHint').not().isEmpty().trim(),
    async (req, res) => {

        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array()[0] });
            }

            const riddleID = await riddlesController.createRiddle(
                req.body.question,
                req.body.response,
                req.body.difficulty,
                req.body.duration,
                req.body.firstHint,
                req.body.secondHint,
                req.user.id
            );

            return res.status(201).send({
                id: riddleID
            });

        } catch (exception) {
            return res.status(500).json({ error: "Something went wrong, try again" });
        }

    }
);

/* Get all riddles */
riddlesRouter.get('/',
    passport.authenticate('session'),
    async (req, res) => {

        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array()[0] });
            }

            const userID = req.hasOwnProperty("user") ? req.user.id : null;
            const riddles = await riddlesController.getAllRiddles(userID);
            return res.json(riddles);

        } catch (exception) {
            return res.status(500).json({ error: "There was a problem loading the riddles, try again later" });
        }
    }
);

/* Get all riddles of the authenticated user */
riddlesRouter.get('/mine',
    passport.authenticate('session'),
    isLoggedIn,
    async (req, res) => {

        try {

            const userID = req.user.id;
            const riddles = await riddlesController.getRiddlesByUser(userID);
            return res.json(riddles);

        } catch (exception) {
            return res.status(500).json({ error: "There was a problem loading the riddles, try again later" });
        }
    }
);

/* Submit a new answer to a riddle */
riddlesRouter.post('/:riddleID/answers',
    passport.authenticate('session'),
    isLoggedIn,
    param('riddleID').toInt().isInt({ min: 1 }),
    body('answer').trim().not().isEmpty(),
    async (req, res) => {

        let transactionBegun = false;

        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array()[0] });
            }

            const riddleID = req.params.riddleID;
            const answer = req.body.answer;
            const submittee = req.user ? req.user.id : null;    

            await beginTransaction();
            transactionBegun = true;
            const riddle = await riddlesDAO.getRiddle(riddleID);

            /*  Check requested riddle exists */
            if (!riddle) {
                await rollbackTransaction();
                return res.status(404).json({ error: "Riddle with specified ID was not found" });
            }

            /*  Check submitting user is not the one who created the riddle */
            if (submittee === riddle.user_id) {
                await rollbackTransaction();
                return res.status(400).json({ error: "You cannot answer your own riddle" });
            }

            /*  Check riddle wasn't already solved */
            if (riddle.solution_found) {
                await rollbackTransaction();
                return res.status(400).json({ error: "Sorry, the riddle has already been solved" });
            }

            /*  Check riddle time hasn't expired */
            if (riddle.start_time !== null && (riddle.start_time + 1000 * riddle.duration) < new Date().getTime()) {
                await rollbackTransaction();
                return res.status(400).json({ error: "Sorry, the riddle closed" });
            }

            const answerIsCorrect = await riddlesController.submitAnswer(riddle, submittee, answer);

            await commitTransaction();

            return res.json(answerIsCorrect);

        } catch (exception) {
            if (transactionBegun)
                await rollbackTransaction();
            return res.status(500).json({ error: "Something went wrong, try again" });
        }

    }
);

/* Retrieve a riddle by ID */
riddlesRouter.get('/:riddleID',
    passport.authenticate('session'),
    param('riddleID').toInt().isInt({ min: 1 }),
    async (req, res) => {

        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array()[0] });
            }

            const riddleID = req.params.riddleID;
            const userID = req.hasOwnProperty("user") ? req.user.id : null;
            const riddle = await riddlesController.getRiddle(riddleID, userID);

            if (riddle) {
                return res.json(riddle);
            } else {
                return res.status(404).json({ error: "Riddle with specified ID was not found" });
            }

        } catch (exception) {
            return res.status(500).json({ error: "There was a problem loading the riddle, try again later" });
        }
    }
);

module.exports = {
    riddlesRouter
};