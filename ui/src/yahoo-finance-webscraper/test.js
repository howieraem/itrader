const yf = require('./index');

yf.getStockBasicInfo('AAPL').then(console.log);
//yf.getStocksInfo(['TSLA', 'AAPL']).then(console.log);