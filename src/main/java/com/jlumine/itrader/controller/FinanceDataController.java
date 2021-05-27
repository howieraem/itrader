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
    private static final String URL_HISTORY = "https://query1.finance.yahoo.com/v7/finance/download/%s?period1=%s&period2=%s&interval=%s&events=history&includeAdjustedClose=true";

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/stockBasic")
    public String getStockBasic(@RequestParam(value = "symbols") List<String> symbols) {
        String url = String.format(URL_BASIC, String.join(",", symbols));
        ResponseEntity<String> results = restTemplate.exchange(url, HttpMethod.GET, null, String.class);
        return results.getBody();
    }

    @GetMapping("/stockDetails")
    public String getStockDetails(
            @RequestParam(value = "symbol") String symbol,
            @RequestParam(value = "modules") List<String> modules) {
        String url = String.format(URL_SNAPSHOT, symbol, String.join(",", modules));
        ResponseEntity<String> results = restTemplate.exchange(url, HttpMethod.GET, null, String.class);
        return results.getBody();
    }

    @GetMapping("/stockHistory")
    public String getStockHistory(
            @RequestParam(value = "symbol") String symbol,
            @RequestParam(value = "from") String from,
            @RequestParam(value = "to") String to,
            @RequestParam(value = "interval") String interval) {
        String url = String.format(URL_HISTORY, symbol, from, to, interval);
        ResponseEntity<String> results = restTemplate.exchange(url, HttpMethod.GET, null, String.class);
        return results.getBody();
    }
}
