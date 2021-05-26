const axios = require('axios');
// const BASE_URL = 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=';
const BASE_URL = 'http://127.0.0.1:8092/stockBasic?symbols=';

const getStockBasicInfo = (symbol, proxyUrl='') => new Promise((resolve, reject) => {
  if (!symbol) return reject(Error('Stock symbol required'));
  if (typeof symbol !== 'string') return reject(Error(`Invalid argument type. Required: string. Found: ${typeof symbol}`));

  let url = `${proxyUrl}${proxyUrl ? '/' : ''}${BASE_URL}${symbol}`;
  return axios.get(url).then((res) => {
    const { data } = res;
      if (!data || !data.quoteResponse || !data.quoteResponse.result || data.quoteResponse.result.length === 0) {
        return resolve(new Error(`Error retrieving info for symbol ${symbol}`));
      }
    return resolve(data.quoteResponse.result[0]);
  }).catch(err => reject(err));
});

const getStocksInfo = stockList => new Promise((resolve, reject) => {
  if (!stockList) return reject(Error('Stock symbol list required'));
  if (!Array.isArray(stockList)) return reject(Error('Invalid argument type. Array required.'));

  const list = [...stockList];
  if (!list.length || list.length < 1) return Promise.resolve([]);

  const promises = list.map(getStockBasicInfo);
  return resolve(Promise.all(promises));
});

module.exports = {
  getStockBasicInfo,
  getStocksInfo,
};