package com.jlumine.itrader.controller;

import com.jlumine.itrader.service.FinanceDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

/**
 * Provides data to frontend acting as a proxy to Yahoo Finance APIs to avoid CORS issues.
 */
@RestController
public class FinanceDataController {
    @Autowired
    FinanceDataService financeDataService;

    @GetMapping("/stockSearch")
    public String searchStock(@RequestParam(value = "name") String name) {
        return financeDataService.searchStock(name);
    }

    @GetMapping("/stockBasic")
    public String getStockBasic(@RequestParam(value = "symbols") List<String> symbols) {
        return financeDataService.getStockBasic(symbols);
    }

    @GetMapping("/exchangeRate")
    public BigDecimal getExchangeRate(@RequestParam(value = "currency") String currency) {
        return financeDataService.getCurrencyExchangeRate(currency);
    }

    @GetMapping("/stockDetails")
    public String getStockDetails(
            @RequestParam(value = "symbol") String symbol,
            @RequestParam(value = "modules") List<String> modules) {
        return financeDataService.getStockDetails(symbol, modules);
    }

    @GetMapping("/stockHistory")
    public String getStockHistory(
            @RequestParam(value = "symbol") String symbol,
            @RequestParam(value = "from") String from,
            @RequestParam(value = "to") String to,
            @RequestParam(value = "interval") String interval) {
        return financeDataService.getStockHistory(symbol, from, to, interval);
    }

    @GetMapping("/stockDividend")
    public String getStockDividend(
            @RequestParam(value = "symbol") String symbol,
            @RequestParam(value = "from") String from,
            @RequestParam(value = "to") String to) {
        return financeDataService.getStockDividend(symbol, from, to);
    }

    @GetMapping("/stockHistoryIntraday")
    public String getStockHistoryIntraday(
            @RequestParam(value = "symbol") String symbol,
            @RequestParam(value = "interval") String interval,
            @RequestParam(value = "range") String range,
            @RequestParam(value = "includePrePost") String includePrePost) {
        return financeDataService.getStockHistoryIntraday(symbol, interval, range, includePrePost);
    }

    @GetMapping("/stockHistoryAdv")
    public String getStockHistoryAdv(
            @RequestParam(value = "symbol") String symbol,
            @RequestParam(value = "from") String from,
            @RequestParam(value = "to") String to,
            @RequestParam(value = "interval") String interval,
            @RequestParam(value = "includePrePost") String includePrePost) {
        return financeDataService.getStockHistoryAdv(symbol, from, to, interval, includePrePost);
    }
}
