import apiRequest from './api';

/**
 * API Call to create a new riddle
 * @param  {string} question - The text of the riddle
 * @param  {string} difficulty - one of ['easy', 'average', 'hard']
 * @param  {string} duration - The duration of the riddle in seconds (30-600)
 * @param  {string} response - The correct answer to the riddle
 * @param  {string} firstHintof - The first hint of the riddle
 * @param  {string} secondHint - The second hint of the riddle
 * @return {object} HTTP response body
 * @throws TypeError
 */
export async function createRiddle(question, difficulty, duration, response, firstHint, secondHint) {
    const riddleData = {
        question,
        difficulty,
        duration,
        response,
        firstHint,
        secondHint
    };
    return await apiRequest('POST', '/riddles', riddleData);
}

/**
 * API Call to get data of a riddle
 * @param  {number} riddleID - The id of the riddle to fetch
 * @return {object} - Riddle data
 * @throws TypeError
 */
export async function fetchRiddle(riddleID) {
    return await apiRequest('GET', '/riddles/' + riddleID);
}

/**
 * API Call to submit an answer to a riddle
 * @param  {number} riddleID - The id of the riddle to answer to
 * @param  {string} answer - The answer to the riddle
 * @return {object} - Riddle data
 * @throws TypeError
 */
export async function submitAnswer(riddleID, answer) {
    return await apiRequest('POST', `/riddles/${riddleID}/answers`, { answer });
}


/**
 * API Call to get All riddles
 * @return {object} - array of Riddles
 * @throws TypeError
 */
export async function getAllRiddles() {
    return await apiRequest('GET', '/riddles');
}


/**
 * API Call to get All riddles of the authenticated user
 * @return {object} - array of Riddles
 * @throws TypeError
 */
export async function getMyRiddles() {
    return await apiRequest('GET', '/riddles/mine');
}