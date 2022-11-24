const stringSimilarity = require("string-similarity");
const riddlesDAO = require("../dao/riddles_dao");
const answerDAO = require("../dao/answers_dao");
const userDAO = require("../dao/users_dao");

/**
 * Show riddle properties according to user and time
 * @param {object} riddle - the riddle to improve
 * @param {number} userID - the user requesting the riddle
 * @returns {object} - The updated riddle
 */
function improveRiddleInfo(riddle, userID) {

    const now = new Date().getTime();
    // Change data sent to client based on riddle state and user
    // riddle.yours = true if user is the creator of the riddle
    riddle.yours = riddle.user_id === userID;
    // Check if riddle has been answered once and riddle.duration seconds have passed
    riddle.closed = riddle.start_time !== null && riddle.start_time + (riddle.duration * 1000) < now;
    if (riddle.answers)
        riddle.answered = riddle.answers.filter(answer => answer.user_id === userID).length > 0;
    if (riddle.start_time) {
        riddle.elapsedTime = Math.round((now - riddle.start_time) / 1000);
        riddle.remainingTime = Math.round(riddle.duration - riddle.elapsedTime);
    }

    if (!riddle.solution_found && !riddle.yours && !riddle.closed) {
        delete riddle.response; // Hide response
        if (riddle.start_time !== null) { // Riddle time started
            if (riddle.remainingTime > 0.25 * riddle.duration) {
                delete riddle.second_hint;  // Hide second hint if remainig time > 75%
                if (riddle.remainingTime > 0.5 * riddle.duration)
                    delete riddle.first_hint;  // Hide first hint if remainig time > 50%
            }
        } else {
            // Hide hints if time hasn't started yet
            delete riddle.first_hint;
            delete riddle.second_hint;
        }
    }

    return riddle;
}



/**
 * Insert a new riddle into the database.
 * @param  {string} question - The text of the riddle
 * @param  {string} response - The correct answer to the riddle
 * @param  {string} difficulty - one of ['easy', 'average', 'hard']
 * @param  {number} duration - The duration of the riddle in seconds (30-600)
 * @param  {string} first_hint - The first hint of the riddle
 * @param  {string} second_hint - The second hint of the riddle
 * @param  {number} userID - The user creating the riddle
 * @returns {Promise<number>} The id of the newly created riddle
 * @throws {Error} 
 */
async function createRiddle(question, response, difficulty, duration, first_hint, second_hint, userID) {
    return await riddlesDAO.createRiddle(question, response, difficulty, duration, first_hint, second_hint, userID);
}

/**
 * Get a riddle from the database.
 * @param  {number} riddleID - The id of the riddle to get
 * @param  {number} userID - The user asking for riddle
 * @returns {Promise<object>} The riddle with the given id
 * @throws {Error} 
 */
async function getRiddle(riddleID, userID) {

    const promises = await Promise.all([
        riddlesDAO.getRiddle(riddleID),
        answerDAO.getAnswers(riddleID)
    ]);
    const riddle = promises[0];

    if (!riddle)
        return null;
    riddle.answers = promises[1];
    return improveRiddleInfo(riddle, userID);
}

/**
 * Submit a user's answer to a riddle.
 * @param  {number} riddleID - The id of the riddle to submit the answer to
 * @param  {number} userID - The user submitting the answer
 * @param  {string} answer - The answer to the riddle
 * @returns {Promise<boolean>} Whether the answer was correct or not
 * @throws {Error} 
 */
async function submitAnswer(riddle, userID, answer) {

    const time = new Date().getTime();
    const answerIsCorrect = stringSimilarity.compareTwoStrings(answer.toLowerCase(), riddle.response.toLowerCase()) >= 0.75;

    if (answerIsCorrect) {

        const difficulties = {
            easy: 1,
            average: 2,
            hard: 3
        }
        const points = difficulties[riddle.difficulty];

        /* Update riddle.solution_found to true */
        await riddlesDAO.setSolutionFound(riddle.id);
        /* Update user points */
        await userDAO.updateUserPoints(userID, points);
    }

    /* Update riddle start_time if it's the first answer */
    if (riddle.start_time === null)
        await riddlesDAO.setStartTime(riddle.id, time);

    /* Save answer to database */
    await answerDAO.submitAnswer(riddle.id, userID, answer, Number(answerIsCorrect));

    return answerIsCorrect;
}

/**
 * Get all riddles of a user
 * @param  {number} userID - The user requesting their own riddles
 * @returns {Promise<array>} An array of riddles
 * @throws {Error}
 */
async function getRiddlesByUser(userID) {
    const riddles = await riddlesDAO.getRiddlesByUser(userID);
    return riddles.map((riddle) => improveRiddleInfo(riddle, userID));
}

/**
 * Get all riddles
 * @param  {number} userID - The user requesting the riddles
 * @returns {Promise<array>} An array of riddles
 * @throws {Error}
 */
async function getAllRiddles(userID) {
    const riddles = await riddlesDAO.getAllRiddles();
    return riddles.map((riddle) => improveRiddleInfo(riddle, userID));
}

module.exports = {
    getRiddlesByUser,
    getAllRiddles,
    createRiddle,
    submitAnswer,
    getRiddle
}