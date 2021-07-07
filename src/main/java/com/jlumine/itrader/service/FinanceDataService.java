package com.jlumine.itrader.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jlumine.itrader.model.StockQuote;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;

@Service
public class FinanceDataService {
    // Note: crumb is not longer required for Yahoo Finance's new APIs
    private static final String URL_BASIC = "https://query1.finance.yahoo.com/v7/finance/quote?symbols=%s";
    private static final String URL_SNAPSHOT = "https://query2.finance.yahoo.com/v10/finance/quoteSummary/%s?modules=%s";
    private static final String URL_HISTORY = "https://query1.finance.yahoo.com/v7/finance/download/%s?period1=%s&period2=%s&interval=%s&events=%s&includeAdjustedClose=true";
    private static final String URL_HISTORY_INTRADAY = "https://query1.finance.yahoo.com/v8/finance/chart/%s?useYfid=true&interval=%s&range=%s&includePrePost=%s";
    private static final String URL_HISTORY_ADV = "https://query1.finance.yahoo.com/v8/finance/chart/%s?useYfid=true&period1=%s&period2=%s&interval=%s&includePrePost=%s";

    @Autowired
    private RestTemplate restTemplate;

    private String forward(String url) {
        return restTemplate.exchange(url, HttpMethod.GET, null, String.class).getBody();
    }

    public String getStockBasic(String symbol) {
        return forward(String.format(URL_BASIC, symbol));
    }

    public String getStockBasic(List<String> symbols) {
        return forward(String.format(URL_BASIC, String.join(",", symbols)));
    }

    public String getStockDetails(String symbol, List<String> modules) {
        return forward(String.format(URL_SNAPSHOT, symbol, String.join(",", modules)));
    }

    public String getStockHistory(String symbol, String from, String to, String interval) {
        return forward(String.format(URL_HISTORY, symbol, from, to, interval, "history"));
    }

    public String getStockDividend(String symbol, String from, String to) {
        return forward(String.format(URL_HISTORY, symbol, from, to, "1d", "div"));
    }

    public String getStockHistoryIntraday(String symbol, String interval, String range, String includePrePost) {
        return forward(String.format(URL_HISTORY_INTRADAY, symbol, interval, range, includePrePost));
    }

    public String getStockHistoryAdv(String symbol, String from, String to, String interval, String includePrePost) {
        return forward(String.format(URL_HISTORY_ADV, symbol, from, to, interval, includePrePost));
    }

    public StockQuote getCurrentQuote(String symbol) {
        JSONObject jsonObject = JSONObject.parseObject(getStockBasic(symbol)).getJSONObject("quoteResponse");
        if (jsonObject.getJSONObject("error") != null)
            throw new RuntimeException(String.format("Failed to fetch stock price for symbol %s.", symbol));
        JSONArray results = jsonObject.getJSONArray("result");
        if (results.isEmpty())  throw new RuntimeException(String.format("Symbol %s does not exist.", symbol));
        JSONObject stockInfo = (JSONObject) results.get(0);

        StockQuote sq = new StockQuote();
        switch (stockInfo.getString("marketState")) {
            case "PRE": sq.setPrice(stockInfo.getBigDecimal("preMarketPrice")); break;
            case "REGULAR": sq.setPrice(stockInfo.getBigDecimal("regularMarketPrice")); break;
            case "POST": sq.setPrice(stockInfo.getBigDecimal("postMarketPrice")); break;
            default: sq.setPrice(BigDecimal.ZERO); break;
        }
        sq.setAsk(stockInfo.getBigDecimal("ask"));
        sq.setAskSize(stockInfo.getLong("askSize"));
        sq.setBid(stockInfo.getBigDecimal("bid"));
        sq.setBidSize(stockInfo.getLong("bidSize"));
        return sq;
    }
}
