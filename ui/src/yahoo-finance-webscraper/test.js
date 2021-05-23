const yf = require('./index');

yf.getSingleStockInfo('AAPL').then(console.log);
//yf.getStocksInfo(['TSLA', 'AAPL']).then(console.log);