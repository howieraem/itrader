# ITrader Project

A paper trading system built with Spring Boot and React.js. Data from Yahoo Finance are used.  

MySQL and Redis details can be edited in `application.properties`.


## Local deployment

### Before Start

* Install JRE and JDK. 
* Install Node.js and then Yarn.  
* Install MySQL and Redis. Ensure they are running.
* Create a schema named "itrader" in MySQL.

### Back End

```
mvn clean install
java -jar target/i-trader-0.0.1-SNAPSHOT.jar
```
Alternatively, you can run it with an IDE like Intellij IDEA. The port is 5000 by default.
You can visit [docs](http://127.0.0.1:5000/doc.html) (display language can be changed in the top-right corner).


### Front End

```
cd ui
yarn install
yarn start
```
Then visit in a browser at [localhost:3000](http://127.0.0.1:3000).


## Notes on Yahoo Finance APIs

If you do not have (fast) access to Yahoo Finance in your region, you can try the following:

- Add `87.248.114.11 finance.yahoo.com query1.yahoo.com query2.yahoo.com` to your host file in OS
- Use a proxy and configure accordingly in `application.properties`


## TODOs
