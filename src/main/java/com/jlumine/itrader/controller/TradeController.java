package com.jlumine.itrader.controller;

import com.jlumine.itrader.payload.SymbolRequest;
import com.jlumine.itrader.payload.ApiResponse;
import com.jlumine.itrader.payload.AuthenticatedRequest;
import com.jlumine.itrader.payload.TradeRequest;
import com.jlumine.itrader.repository.PositionRepository;
import com.jlumine.itrader.service.FinanceDataService;
import com.jlumine.itrader.service.TradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.math.BigDecimal;

@RestController
public class TradeController {
    @Autowired
    private PositionRepository positionRepository;

    @Autowired
    private FinanceDataService financeDataService;

    @Autowired
    private TradeService tradeService;

    @PostMapping("/trade")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> trade(
            @Valid @RequestBody TradeRequest tradeRequest,
            AuthenticatedRequest authenticatedRequest) {
        String symbol = tradeRequest.getSymbol();
        long qty = Long.parseLong(tradeRequest.getQty());
        BigDecimal price = financeDataService.getCurrentQuote(symbol).getPrice();
        tradeService.process(authenticatedRequest.getUserId(), symbol, qty, price);
        return ResponseEntity.ok(new ApiResponse(true, "Trade completed!"));
    }

    @PostMapping("/affordability")
    @PreAuthorize("hasRole('USER')")
    @ResponseBody
    public Long getAffordability(
            @Valid @RequestBody SymbolRequest symbolRequest,
            AuthenticatedRequest authenticatedRequest) {
        String symbol = symbolRequest.getSymbol();
        BigDecimal price = financeDataService.getCurrentQuote(symbol).getPrice();
        return tradeService.getAffordableQty(authenticatedRequest.getUserId(), price);
    }

    @PostMapping("/positionQty")
    @PreAuthorize("hasRole('USER')")
    @ResponseBody
    public Long getPositionQty(
            @Valid @RequestBody SymbolRequest symbolRequest,
            AuthenticatedRequest authenticatedRequest) {
        return positionRepository.findFirstQuantityByUserIdAndSymbol(
                authenticatedRequest.getUserId(), symbolRequest.getSymbol())
                .orElse(0L);
    }
}
