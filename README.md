# ITrader Project

A paper trading system built with Spring Boot and React.js. Data from Yahoo Finance are used.

MySQL and Redis details can be edited in `application.properties`.

## Notes on Yahoo Finance APIs
If you do not have (smooth) access to Yahoo Finance in your region, you can try the following:

- Add `87.248.114.11 finance.yahoo.com query1.yahoo.com query2.yahoo.com` to your host file in OS
- Use a proxy and enter its information in `application.properties`

## TODOs

### Back end
- [ ] Implement limit order (trade won't happen if order price does not match market price)
- [ ] User preferences on showing/hiding specific chart indicators  
- [ ] Statistics of the platform: active users, total turnover, etc.

### Front end
- [ ] Rewrite the top right buttons to show user avatar when signed in, and fix the drop down menu in narrow screen
- [ ] Add more indicators to the chart, and user preferences on these on the settings page
- [ ] Add a left menu, and make watchlist, portfolio and trade history separate pages