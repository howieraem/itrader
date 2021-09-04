import '../components/stockView/StockView.css';
import React from 'react';
import { addTicker, removeTicker } from 'stocksocket';
import { Helmet } from "react-helmet";
import { getMarketStates } from '../utils/DataAPI';
import StockViewCore from "../components/stockView/StockViewCore";

const roundNumber = (number, places=4) => {
  if (number === undefined || number === null)  return "N/A";
  return number.toFixed(places);
}

export default function StockView(props) {
  const { symbol } = props;
  const [regularMarketOpen, setRegularMarketOpen] = React.useState(false);
  const [dataTime, setDataTime] = React.useState(null);
  const [livePrice, setLivePrice] = React.useState(0.);
  const [change, setChange] = React.useState(0.);
  const [changePercent, setChangePercent] = React.useState(0.);
  const [dayVolume, setDayVolume] = React.useState(0);

  React.useEffect(() => {
    getMarketStates([symbol])
    .then(res => setRegularMarketOpen(res[0] === "REGULAR"))
  }, [symbol])

  React.useEffect(() => {
    /* 
    Live Data Fields:
    id
    price
    time
    exchange
    quoteType
    marketHours
    changePercent
    dayVolume
    change
    lastSize
    priceHint
    */
    const updateLiveData = (liveData) => {
      setDataTime(new Date(liveData.time));
      setLivePrice(roundNumber(liveData.price, 3));
      setChange(roundNumber(liveData.change, 3));
      setChangePercent(roundNumber(liveData.changePercent, 2));
      setDayVolume(liveData.dayVolume);
    };
    if (regularMarketOpen) {
      addTicker(symbol, updateLiveData);
    }

    return () => {
      if (regularMarketOpen) {
        removeTicker(symbol);
        setLivePrice(0);
        setChange(0);
        setChangePercent(0);
      }
    };
  }, [symbol, regularMarketOpen]);

  return (
    <>
      <Helmet>
        <title>ITrader - {symbol}</title>
      </Helmet>
      <StockViewCore
        marketOpen={regularMarketOpen}
        dataTime={dataTime}
        livePrice={livePrice}
        change={change}
        changePercent={changePercent}
        dayVolume={dayVolume}
        {...props}
      />
    </>
  );
}
