import { SERVER_URL } from '../constants';
import axios from 'axios';
import { csvParse } from "d3";
import { timeParse } from "d3-time-format";


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

function getUserDetails(field) {
    const token = getToken();
    if (!token) {
        return Promise.reject("No access token set. Please log in again.");
    }
    return request({
        url: SERVER_URL + `/${field}`,
        method: 'GET'
    }, token);
}

export function getPortfolio() {
    return getUserDetails('portfolio');
}

export function getTrades() {
    return getUserDetails('trades');
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

export function trade(tradeRequest) {
    const token = getToken();
    if (!token) {
        return Promise.reject("No access token set. Please log in again.");
    }
    return request({
        url: SERVER_URL + "/trade",
        method: 'POST',
        body: JSON.stringify(tradeRequest)
    }, token);
}

export function getStockBasicInfo(symbol) {  
    return new Promise((resolve, reject) => {
        if (!symbol) return reject(Error('Stock symbol cannot be empty.'));

        const url = SERVER_URL + `/stockBasic?symbols=${symbol}`;
        return axios.get(url).then((res) => {
            const { data } = res;
            if (!data || !data.quoteResponse || !data.quoteResponse.result || data.quoteResponse.result.length === 0) {
                return resolve(new Error(`Error retrieving info for symbol ${symbol}.`));
            }
            return resolve(data.quoteResponse.result[0]);
        }).catch(err => reject(err));
    });
}

export const parseDate = timeParse("%Y-%m-%d");

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

function parseIntraday(raw) {
  const responseDetails = JSON.parse(raw).chart;
  if (responseDetails.error)  throw new Error(responseDetails.error.description);
  const d = responseDetails.result[0];
  const indicators = d.indicators.quote[0], time = d.timestamp;

  let data = [];
  for (let i = 0; i < time.length; ++i) {
    data.push({
      date: new Date(time[i] * 1000),
      open: indicators.open[i],
      high: indicators.high[i],
      low: indicators.low[i],
      close: indicators.close[i],
      volume: indicators.volume[i],
    })
  }
  return data;
}

export function getStockHistory(symbol, interval="w", from="0", to="9999999999") {
  switch (interval) {
    case 'w': interval = '1wk'; break;
    case 'm': interval = '1mo'; break;
    case 'q': interval = '3mo'; break;
    case 'y': interval = '3mo'; break;  // TODO convert quarter to year
    default: interval = '1d'; break;
  }
	const promise = fetch(`http://127.0.0.1:8092/stockHistory?symbol=${symbol}&from=${from}&to=${to}&interval=${interval}`)
		.then(response => response.text())
		.then(data => csvParse(data, parseRow))
        .catch(err => { 
            console.log(err) 
        })
	return promise;
};

export function getStockDividend(symbol, from="0", to="9999999999") {
	const promise = fetch(`http://127.0.0.1:8092/stockDividend?symbol=${symbol}&from=${from}&to=${to}`)
		.then(response => response.text())
		.then(data => csvParse(data, parseRow))
        .catch(err => { 
            console.log(err) 
        })
	return promise;
};

export function getStockToday(symbol, minuteInterval=1, includePrePost=false) {
    // Volume data for pre/post market are missing, so `includePrePost` is false by default
    let interval;
    switch (minuteInterval) {
        case 5: interval = "5m"; break;
        case 15: interval = "15m"; break;
        case 30: interval = "30m"; break;
        case 60: interval = "1h"; break;
        case 90: interval = "90m"; break;
        default: interval = "1m"; break;
    }
	const promise = fetch(`http://127.0.0.1:8092/stockHistoryIntraday?symbol=${symbol}&interval=${interval}&range=7d&includePrePost=${includePrePost}`)
		.then(response => response.text())
    .then(data => parseIntraday(data))
        .catch(err => { 
            console.log(err) 
        })
	return promise;
};