package com.jlumine.itrader.controller;

import com.jlumine.itrader.payload.ApiResponse;
import com.jlumine.itrader.payload.TradeRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import yahoofinance.Stock;
import yahoofinance.YahooFinance;

import javax.validation.Valid;
import java.io.IOException;
import java.math.BigDecimal;

@RestController
public class TradeController {
    // TODO write own request to get quote instead of using a 3rd party API
    private static final String URL_BASIC = "https://query1.finance.yahoo.com/v7/finance/quote?symbols=%s";

    @Autowired
    private RestTemplate restTemplate;

    @PostMapping("/trade")
    @Transactional
    public ResponseEntity<?> trade(@Valid @RequestBody TradeRequest tradeRequest) throws IOException {
        Stock stock = YahooFinance.get(tradeRequest.getSymbol());
        BigDecimal total = stock.getQuote(true).getAsk()
                .multiply(new BigDecimal(tradeRequest.getAmount()));
        return ResponseEntity.ok(new ApiResponse(true, "Transaction completed!"));
    }

}
