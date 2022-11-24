"use strict";
const crypto = require("crypto");
const usersDAO = require("../dao/users_dao");

/**
 * Authenticate the user.
 * @param  {string} username Name identifying the user to log-in
 * @param  {string} password The password of the user to log-in
 * @return {Promise<object|false>} The user info is returned if authentication was successful
 * @throws Error
 */
async function login(username, password) {

    // Retrieve user from DB
    const user = await usersDAO.getUser(username);

    if (user === undefined)
        return false;

    // Compare provided password with stored one
    const salt = user.salt;
    const storedHash = user.hash;

    const result = await new Promise((resolve, reject) => {

        crypto.scrypt(password, salt, 32, (err, hashedPassword) => {

            if (err)
                reject(err);

            if (crypto.timingSafeEqual(Buffer.from(storedHash, 'hex'), hashedPassword))
                resolve({
                    id: user.id,
                    username: user.username,
                    name: user.name
                });
            else
                resolve(false);
        });
    });

    return result;
}


/**
 * Retrieve the leaderboard of the game.
 * @returns {Promise<Array>}
 * @throws Error
 */
async function getTop3Scores() {
    return await usersDAO.getTop3Scores();
}


module.exports = {
    login,
    getTop3Scores
}