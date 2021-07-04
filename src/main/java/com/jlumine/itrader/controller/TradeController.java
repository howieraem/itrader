package com.jlumine.itrader.controller;

import com.jlumine.itrader.payload.ApiResponse;
import com.jlumine.itrader.payload.AuthenticatedRequest;
import com.jlumine.itrader.payload.TradeRequest;
import com.jlumine.itrader.service.FinanceDataService;
import com.jlumine.itrader.service.TradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.io.IOException;
import java.math.BigDecimal;

@RestController
public class TradeController {
    @Autowired
    private FinanceDataService financeDataService;

    @Autowired
    private TradeService tradeService;

    @PostMapping("/trade")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> trade(
            @Valid @RequestBody TradeRequest tradeRequest,
            AuthenticatedRequest authenticatedRequest)
            throws IOException {
        String symbol = tradeRequest.getSymbol();
        long qty = Long.parseLong(tradeRequest.getQty());
        BigDecimal price = financeDataService.getCurrentQuote(symbol).getAsk();
        tradeService.trade(authenticatedRequest.getUserId(), symbol, qty, price);
        return ResponseEntity.ok(new ApiResponse(true, "Transaction completed!"));
    }
}
