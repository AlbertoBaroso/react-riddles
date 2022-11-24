const { db } = require("../database/db");


/**
 * Creates a new answer in the database
 * @param  {number} riddleID - The id of the riddle to submit the answer to
 * @param  {number} userID - The user submitting the answer
 * @param  {string} answer - The answer to the riddle
 * @param  {boolean} winner - Whether the user was correct or not
 * @returns {Promise<>} 
 * @throws {Error} 
 */
function submitAnswer(riddleID, userID, answer, winner) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO answer (user_id, riddle_id, answer, winner) VALUES (?, ?, ?, ?)";
        db.run(sql,
            [
                userID,
                riddleID,
                answer,
                winner
            ],
            (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
    });
}


/**
 * Get all answers for a riddle
 * @param  {number} riddleID - The id of the riddle to get the answers for
 * @returns {Promise<array>} The answers for the riddle
 * @throws {Error}
 */
function getAnswers(riddleID) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT answer.*, profile_image, username
                     FROM answer JOIN user ON (answer.user_id = user.id)
                     WHERE riddle_id = ?`;
        db.all(sql, [riddleID], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
}


module.exports = {
    submitAnswer,
    getAnswers
}