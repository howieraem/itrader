import { SERVER_URL, ACCESS_TOKEN } from '../constants';
import axios from 'axios';
import { csvParse } from "d3";
import { timeParse } from "d3-time-format";


const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
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

export function getCurrentUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: SERVER_URL + "/user/me",
        method: 'GET'
    });
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

export function getStockBasicInfo(symbol) {  
    return new Promise((resolve, reject) => {
        if (!symbol) return reject(Error('Stock symbol cannot be empty.'));

        let url = SERVER_URL + `/stockBasic?symbols=${symbol}`;
        return axios.get(url).then((res) => {
            const { data } = res;
            if (!data || !data.quoteResponse || !data.quoteResponse.result || data.quoteResponse.result.length === 0) {
                return resolve(new Error(`Error retrieving info for symbol ${symbol}.`));
            }
            return resolve(data.quoteResponse.result[0]);
        }).catch(err => reject(err));
    });
}

const parseDate = timeParse("%Y-%m-%d");

function parseRow(d) {
	return {
		date: parseDate(d.Date),
		open: +d.Open,
		high: +d.High,
		low: +d.Low,
		close: +d.Close,
		volume: +d.Volume,
	}
}

export function getStockHistory(symbol, from="0", to="9999999999", interval="1d") {
	const promise = fetch(`http://127.0.0.1:8092/stockHistory?symbol=${symbol}&from=${from}&to=${to}&interval=${interval}`)
		.then(response => response.text())
		.then(data => csvParse(data, parseRow))
	return promise;
};
