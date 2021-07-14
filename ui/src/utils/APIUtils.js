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
    return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
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

function getUserDetails(field, page=-1, rows=-1) {
    const token = getToken();
    if (!token) {
        return Promise.reject("No access token set. Please log in again.");
    }
    let url = SERVER_URL + `/${field}`
    if (page >= 0) {
        url += `?page=${page}`;
    }
    if (rows >= 0) {
        url += `&rows=${rows}`;
    }
    return request({
        url,
        method: 'GET'
    }, token);
}

export function getPortfolio(page, rows=5) {
    return getUserDetails('portfolio', page, rows);
}

export function getNumOfPositions() {
    return getUserDetails('numOfPositions');
}

export function getTrades(page, rows=10) {
    return getUserDetails('trades', page, rows);
}

export function getNumOfTrades() {
    return getUserDetails('numOfTrades');
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
