import { SERVER_URL } from '../constants';


const request = (options, token=null) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if (token) {
        headers.append('Authorization', 'Bearer ' + token);
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

const getToken = () => {
    let token = localStorage.getItem('accessToken');
    if (!token) {
        token = sessionStorage.getItem('accessToken');
    }
    return token;
}

export function getCurrentUser() {
    const token = getToken();
    if (!token) {
        return Promise.reject("No access token set. Please log in again.");
    }
    return request({
        url: SERVER_URL + "/user/me",
        method: 'GET'
    }, token);
}

function getUserDetails(field, rows=-1) {
    const token = getToken();
    if (!token) {
        return Promise.reject("No access token set. Please log in again.");
    }
    return request({
        url: SERVER_URL + `/${field}?rows=${rows}`,
        method: 'GET'
    }, token);
}

export function getPortfolio(rows=5) {
    return getUserDetails('portfolio', rows);
}

export function getTrades(rows=10) {
    return getUserDetails('trades', rows);
}

export function login(loginRequest) {
    return request({
        url: SERVER_URL + "/auth/login",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: SERVER_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function authenticatedPost(api, body) {
    const token = getToken();
    if (!token) {
        return Promise.reject("No access token set. Please log in again.");
    }
    return request({
        url: SERVER_URL + `/${api}`,
        method: 'POST',
        body: JSON.stringify(body)
    }, token);
}

export function trade(tradeRequest) {
    return authenticatedPost('trade', tradeRequest); 
}

export function getAffordable(symbol) {
    return authenticatedPost('affordability', {symbol});
}

export function getHolding(symbol) {
    return authenticatedPost('positionQty', {symbol});
}
