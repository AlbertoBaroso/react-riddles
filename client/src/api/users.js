import apiRequest from './api';

/**
 * API Call to login user
 * @param  {string} username of the user to login
 * @param  {string} password of the user to login
 * @return {object} HTTP response body
 * @throws TypeError
 */
export async function login(username, password) {
    const userData = {
        username,
        password
    };
    return apiRequest('POST', '/users/login', userData);
}


/**
 * API Call to logout user
 * @throws TypeError
 */
export async function logout() {
    return apiRequest('DELETE', '/users/logout');
}


/**
 * API Call to retrieve top 3 scoring users
 * @return {array} top 3 user
 * @throws TypeError
 */
export async function getTop3Users() {
    return apiRequest('GET', '/users/top3');
}