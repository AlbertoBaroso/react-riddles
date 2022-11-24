/**
 * Create a custom HTTP API request
 * @param  {string} method HTTP method: GET, POST, PUT, DELETE..
 * @param  {string} request_url HTTP request path
 * @param  {object} [data] optional HTTP request body
 * @return {object} HTTP response body
 * @throws TypeError
 */
async function apiRequest(method, request_url, data = null) {
    try {

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            mode: 'cors',
        };

        if (data !== null)
            options.body = JSON.stringify(data);

        const result = await fetch(process.env.REACT_APP_API_URL + request_url, options);
        if (!result.ok) {
            const text = await result.text();
            throw new TypeError(text);
        }

        return await result.json();

    } catch (exception) {
        console.log(exception);
        throw exception;
    }
}

export default apiRequest;
