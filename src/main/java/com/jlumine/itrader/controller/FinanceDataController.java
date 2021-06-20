package com.jlumine.itrader.controller;

// import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

/**
 * A Proxy for Yahoo Finance APIs to avoid CORS issues.
 */
@RestController
public class FinanceDataController {
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

    @GetMapping("/stockBasic")
    public String getStockBasic(@RequestParam(value = "symbols") List<String> symbols) {
        return forward(String.format(URL_BASIC, String.join(",", symbols)));
    }

    @GetMapping("/stockDetails")
    public String getStockDetails(
            @RequestParam(value = "symbol") String symbol,
            @RequestParam(value = "modules") List<String> modules) {
        return forward(String.format(URL_SNAPSHOT, symbol, String.join(",", modules)));
    }

    @GetMapping("/stockHistory")
    public String getStockHistory(
            @RequestParam(value = "symbol") String symbol,
            @RequestParam(value = "from") String from,
            @RequestParam(value = "to") String to,
            @RequestParam(value = "interval") String interval) {
        return forward(String.format(URL_HISTORY, symbol, from, to, interval, "history"));
    }

    @GetMapping("/stockDividend")
    public String getStockDividend(
            @RequestParam(value = "symbol") String symbol,
            @RequestParam(value = "from") String from,
            @RequestParam(value = "to") String to) {
        return forward(String.format(URL_HISTORY, symbol, from, to, "1d", "div"));
    }

    @GetMapping("/stockHistoryIntraday")
    public String getStockHistoryIntraday(
            @RequestParam(value = "symbol") String symbol,
            @RequestParam(value = "interval") String interval,
            @RequestParam(value = "range") String range,
            @RequestParam(value = "includePrePost") String includePrePost) {
        return forward(String.format(URL_HISTORY_INTRADAY, symbol, interval, range, includePrePost));
    }

    @GetMapping("/stockHistoryAdv")
    public String getStockHistoryAdv(
            @RequestParam(value = "symbol") String symbol,
            @RequestParam(value = "from") String from,
            @RequestParam(value = "to") String to,
            @RequestParam(value = "interval") String interval,
            @RequestParam(value = "includePrePost") String includePrePost) {
        return forward(String.format(URL_HISTORY_ADV, symbol, from, to, interval, includePrePost));
    }
}
