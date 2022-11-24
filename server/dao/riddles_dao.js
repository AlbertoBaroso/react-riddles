const { db } = require("../database/db");

/**
 * Retrieve a riddle by its id.
 * @param  {number} riddleId The id of the riddle to retrieve
 * @return {Promise<object|undefined>} Riddle data is returned if a riddle with provided id exists
 * @throws Error
 */
function getRiddle(riddleId) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT riddle.*, username 
        FROM riddle JOIN user ON user.id = riddle.user_id 
        WHERE riddle.id = ?`;
        db.get(sql, [riddleId], (err, riddle) => {
            if (err)
                reject(err);
            else
                resolve(riddle);
        });
    });
}

/**
 * Insert a new riddle into the database.
 * @param  {string} question - The text of the riddle
 * @param  {string} response - The correct answer to the riddle
 * @param  {string} difficulty - one of ['easy', 'average', 'hard']
 * @param  {string} duration - The duration of the riddle in seconds (30-600)
 * @param  {string} first_hint - The first hint of the riddle
 * @param  {string} second_hint - The second hint of the riddle
 * @param  {string} userID - The author of the riddle
 * @return {Promise<number>} The id of the newly created riddle
 * @throws Error
 */
function createRiddle(question, response, difficulty, duration, first_hint, second_hint, userID) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO riddle (question, response, difficulty, duration, first_hint, second_hint, user_id, solution_found) VALUES (?, ?, ?, ?, ?, ?, ?, 0)";
        db.run(
            sql,
            [
                question,
                response,
                difficulty,
                duration,
                first_hint,
                second_hint,
                userID
            ],
            function (err) {
                if (err)
                    reject(err);
                else
                    resolve(this.lastID);
            });
    });
}

/**
 * Set the solution found flag to true for a riddle.
 * @param  {number} riddleID The id of the riddle to set the solution_found flag for
 * @return {Promise<>}
 * @throws Error 
 */
function setSolutionFound(riddleID) {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE riddle SET solution_found = 1 WHERE id = ?";
        db.run(sql, [riddleID], (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
}

/**
 * Set the starting time of a riddle.
 * @param  {number} riddleID The id of the riddle to set the starting time for
 * @param  {number} time The time to set the starting time to
 * @return {Promise<>}
 * @throws Error
 */
function setStartTime(riddleID, time) {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE riddle SET start_time = ? WHERE id = ?";
        db.run(sql, [time, riddleID], (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
}


/**
 * Get all riddles in the database.
 * @return {Promise<array>}
 * @throws Error
 */
function getAllRiddles() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT riddle.*, username 
                     FROM riddle JOIN user ON user.id = riddle.user_id`;
        db.all(sql, [], (err, riddles) => {
            if (err)
                reject(err);
            else
                resolve(riddles);
        });
    });
}




/**
 * Get all riddles of a user.
 * @param  {number} userID The id of the user to get the riddles for
 * @return {Promise<array>}
 * @throws Error
 */
function getRiddlesByUser(userID) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT riddle.*, username 
                     FROM riddle JOIN user ON user.id = riddle.user_id 
                     WHERE user_id = ?`;
        db.all(sql, [userID], (err, riddles) => {
            if (err)
                reject(err);
            else
                resolve(riddles);
        });
    });
}

module.exports = {
    getRiddlesByUser,
    setSolutionFound,
    getAllRiddles,
    setStartTime,
    createRiddle,
    getRiddle,
}