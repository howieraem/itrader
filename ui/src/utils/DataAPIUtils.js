import { SERVER_URL } from '../constants';
import axios from 'axios';
import { csvParse } from "d3";
import { timeParse } from "d3-time-format";

export function getExchangeRate(currency) {
  return new Promise((resolve, reject) => {
    if (!currency || currency === "USD") return resolve(1);
    const url = SERVER_URL + `/exchangeRate?currency=${currency}`;
    return axios.get(url).then((res) => {
      const { data } = res;
      if (!data) {
          return resolve(new Error(`Failed to get exchange rate for ${currency}.`));
      }
      return resolve(data);
    }).catch(err => reject(err));
  });
};

export function searchTicker(str) {
  return new Promise((resolve, reject) => {
    if (!str) return resolve([]);
    const url = SERVER_URL + `/stockSearch?name=${str}`;
    return axios.get(url).then((res) => {
      const { data } = res;
      if (!data || !data.quotes) {
          return resolve(new Error(`Got errors while searching ${str}.`));
      }
      const quotes = data.quotes;
      return resolve(quotes.filter(quote => quote.quoteType === "EQUITY" && quote.isYahooFinance));
    }).catch(err => reject(err));
  });
};

export function getStockBasicInfo(symbol) {  
  return new Promise((resolve, reject) => {
    if (!symbol) return reject(Error('Stock symbol cannot be empty!'));

    const isMulti = symbol instanceof Array;
    const url = SERVER_URL + `/stockBasic?symbols=${isMulti ? symbol.join() : symbol}`;
    return axios.get(url).then((res) => {
      const { data } = res;
      if (!data || !data.quoteResponse || !data.quoteResponse.result || data.quoteResponse.result.length === 0) {
          return resolve(new Error(`Error retrieving info for symbol ${symbol}.`));
      }
      if (isMulti)  return resolve(data.quoteResponse.result);
      return resolve(data.quoteResponse.result[0]);
    }).catch(err => reject(err));
  });
}

export function getBatchStockPrices(symbols) {
  return new Promise((resolve, reject) => {
    return getStockBasicInfo(symbols).then(result => {
      const promises = result.map(
        (quote) => getExchangeRate(quote.currency.toUpperCase())
                   .then(rate => {
                      // let price;
                      // if (marketState === "PRE")  price = quote.preMarketPrice;
                      // else if (marketState === "POST" || marketClosed)  price = quote.postMarketPrice;
                      // else  price quote.regularMarketPrice;
                      return (quote.regularMarketPrice / rate).toFixed(4);
                   })
      );
      return resolve(Promise.all(promises));
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

function parseIntraday(raw) {
  const responseDetails = JSON.parse(raw).chart;
  if (!responseDetails)  throw new Error("Intraday data is blank!");
  if (responseDetails.error)  throw new Error(responseDetails.error.description);
  const d = responseDetails.result[0];
  const indicators = d.indicators.quote[0], time = d.timestamp;
  if (!time)  return [{}];

  let data = [];
  for (let i = 0; i < time.length; ++i) {
    const date = new Date(time[i] * 1000);
    if (i > 0 && indicators.open[i] === null) {
      // no exchange at this minute
      const preClose = data[i - 1].close;
      data.push({
        date,
        open: preClose,
        high: preClose,
        low: preClose,
        close: preClose,
        volume: 0,
      });
    } else {
      data.push({
        date,
        open: indicators.open[i],
        high: indicators.high[i],
        low: indicators.low[i],
        close: indicators.close[i],
        volume: indicators.volume[i],
      });
    }
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
  const promise = fetch(SERVER_URL + `/stockHistory?symbol=${symbol}&from=${from}&to=${to}&interval=${interval}`)
  .then(response => response.text())
  .then(data => csvParse(data, parseRow))
    .catch(err => { 
      console.log(err) 
    })
  return promise;
};

export function getStockDividend(symbol, from="0", to="9999999999") {
  const promise = fetch(SERVER_URL + `/stockDividend?symbol=${symbol}&from=${from}&to=${to}`)
    .then(response => response.text())
    .then(data => csvParse(data, parseRow))
      .catch(err => { 
        console.log(err) 
      })
  return promise;
};

export function getStockToday(symbol, minuteInterval=1, dayRange=5, includePrePost=false) {
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
  const promise = fetch(SERVER_URL + `/stockHistoryIntraday?symbol=${symbol}&interval=${interval}&range=${dayRange}d&includePrePost=${includePrePost}`)
    .then(response => response.text())
    .then(data => parseIntraday(data))
    .catch(err => { 
      console.log(err) 
    })
  return promise;
};
