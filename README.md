# ITrader Project

An online trading simulation system built with Springboot and React.js.

## Notes on Yahoo Finance APIs
If you do not have access to Yahoo Finance in your region, you can try the following:

- Add `87.248.114.11 finance.yahoo.com query1.yahoo.com query2.yahoo.com` to your host file in OS
- Use a proxy and enter its information in `application.properties`

## TODOs

### Backend
- [ ] User details: balance, nickname, avatar (as file path on server), trade (filled/unfilled order) history, position, etc
- [ ] REST API to retrive user details
- [ ] "Remember me" or not when log in 
- [ ] Using NoSQL to store sessions and real-time user updates 
- [ ] Distributed computing (Advanced) 

### Frontend
- [ ] Rearrange layout to have more containers with different functionalities
- [ ] Order history (no matter filled or not) table
- [ ] Alert
- [ ] Charts for other frequencies: 1week, 1month, 1year, etc
- [ ] Stock details page (refer to yahoo finance API for all available fields)
- [ ] User profile and settings (link to user details in backend)
