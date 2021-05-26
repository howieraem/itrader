package com.jlumine.itrader.controller;

//import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
public class FinanceDataController {
    private static final String BASIC_URL = "https://query1.finance.yahoo.com/v7/finance/quote?symbols=";
    private static final String SNAPSHOT_URL = "https://query2.finance.yahoo.com/v10/finance/quoteSummary/";

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/stockBasic")
    public String getStockBasic(@RequestParam(value = "symbols") List<String> symbols) {
        String url = BASIC_URL + String.join(",", symbols);
        ResponseEntity<String> results = restTemplate.exchange(url, HttpMethod.GET, null, String.class);
        return results.getBody();
    }

    @GetMapping("/stockDetails")
    public String getStockDetails(
            @RequestParam(value = "symbol") String symbol,
            @RequestParam(value = "modules") List<String> modules) {
        String url = SNAPSHOT_URL + symbol + "?modules=" + String.join(",", modules);
        ResponseEntity<String> results = restTemplate.exchange(url, HttpMethod.GET, null, String.class);
        return results.getBody();
    }
}
