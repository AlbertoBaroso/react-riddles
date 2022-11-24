const { db } = require("../database/db");
const crypto = require("crypto");

/**
 * Retrieve a user by its username.
 * @param  {string} username The username of the user to retrieve
 * @return {Promise<object|undefined>} User data is returned if a user with provided username exists
 * @throws Error
 */
function getUser(username) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM user WHERE username = ?";
        db.get(sql, [username], (err, user) => {
            if (err)
                reject(err);
            else
                resolve(user);
        });
    });
}


/**
 * Save a user in the database.
 * @param  {string} username The username of the user to create
 * @param  {string} password The password of the user to create
 * @param  {number} points The points of the user to create
 * @param  {string} profile_image The name of the profile image of the user to create
 * @throws Error
 */
async function createUser(username, password, points, profile_image) {
    const salt = crypto.randomBytes(16);
    crypto.scrypt(password, salt, 32, (err, hash) => {
        if (err) {
            throw err;
        }
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO user (username, points, profile_image, hash, salt) VALUES (?, ?, ?, ?, ?)";
            db.run(sql, [username, points, profile_image, hash, salt], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    });

}



/**
 * Initialize users in the database
 */
function initUsers() {
    createUser('Mark', 'password', 0, 'user1');
    createUser('Paul', 'password', 0, 'user2');
    createUser('Sophie', 'password', 0, 'user3');
    createUser('John', 'password', 0, 'user4');
    createUser('Miriam', 'password', 0, 'user5');
}
// initUsers();


/**
 * Retrieve top 3 scores and relative users
 * @returns {Promise<Array>}
 * @throws Error
 */
function getTop3Scores() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id, username, points, profile_image FROM user WHERE points IN
                        (SELECT DISTINCT(points) FROM user ORDER BY points DESC LIMIT 3)
                    ORDER BY points DESC`;
        db.all(sql, (err, users) => {
            if (err)
                reject(err);
            else
                resolve(users);
        });
    });
}

/**
 * Increase the score of a user
 * @param  {number} userID The id of the user to increase the score to
 * @param  {number} points The number of points to add to the user
 * @returns {Promise<>}
 * @throws Error
 */
function updateUserPoints(userID, points) {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE user SET points = points + ? WHERE id = ?";
        db.run(sql, [points, userID], (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });             
    });
}


module.exports = {
    getUser,
    createUser,
    getTop3Scores,
    updateUserPoints
}