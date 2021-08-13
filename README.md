# ITrader Project

A paper trading system built with Spring Boot and React.js. Data from Yahoo Finance are used. A live version is available at [here](itrader.ap-southeast-1.elasticbeanstalk.com).

MySQL and Redis details can be edited in `application.properties`.


## Local deployment

### Before Start

* Install JRE and JDK. 
* Install Node.js and then Yarn.  
* Install MySQL and Redis. Ensure they are running.


### Back End

```
mvn clean install
java -jar target/i-trader-0.0.1-SNAPSHOT.jar
```
Alternatively, you can run it with an IDE like Intellij IDEA.


### Front End

```
cd ui
yarn install
yarn start
```
Then visit in a browser at [127.0.0.1:3000](http://127.0.0.1:3000).


## Notes on Yahoo Finance APIs

If you do not have (fast) access to Yahoo Finance in your region, you can try the following:

- Add `87.248.114.11 finance.yahoo.com query1.yahoo.com query2.yahoo.com` to your host file in OS
- Use a proxy and configure accordingly in `application.properties`


## TODOs

### Back end
- [ ] Implement limit order (trade won't happen if order price does not match market price)
- [ ] User preferences on showing/hiding specific chart indicators  
- [ ] Statistics of the platform: active users, total turnover, etc.

### Front end
- [ ] Add more indicators to the chart, and user preferences on these on the settings page
