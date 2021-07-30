package com.jlumine.itrader.controller;

import com.jlumine.itrader.payload.*;
import com.jlumine.itrader.repository.PositionRepository;
import com.jlumine.itrader.service.FinanceDataService;
import com.jlumine.itrader.service.TradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.math.BigDecimal;

@RestController
@CacheConfig(cacheNames = "userCache")
public class TradeController {
    @Autowired
    private PositionRepository positionRepository;

    @Autowired
    private FinanceDataService financeDataService;

    @Autowired
    private TradeService tradeService;

    @PostMapping("/trade")
    @PreAuthorize("hasRole('USER')")
    @Caching(evict = {
            @CacheEvict(cacheNames = "userPortfolio", key = "#authenticatedRequest.getUserId()", beforeInvocation = true),
            @CacheEvict(cacheNames = "user", key = "#authenticatedRequest.getUserId()", beforeInvocation = true),
    })
    public ResponseEntity<?> trade(
            @Valid @RequestBody TradeRequest tradeRequest,
            AuthenticatedRequest authenticatedRequest) {
        String symbol = tradeRequest.getSymbol();
        long qty = Long.parseLong(tradeRequest.getQty());
        BigDecimal price = financeDataService.getCurrentQuote(symbol).getPrice();
        tradeService.process(authenticatedRequest.getUserId(), symbol, qty, price);
        return ResponseEntity.ok(new ApiResponse(true, "Trade completed!"));
    }

    @PostMapping("/tradable")
    @PreAuthorize("hasRole('USER')")
    @ResponseBody
    public ResponseEntity<?> getTradable(
            @Valid @RequestBody SymbolRequest symbolRequest,
            AuthenticatedRequest authenticatedRequest) {
        String symbol = symbolRequest.getSymbol();
        BigDecimal price = financeDataService.getCurrentQuote(symbol).getPrice();
        long affordable = tradeService.getAffordableQty(authenticatedRequest.getUserId(), price);
        long sellable = positionRepository.findFirstQuantityByUserIdAndSymbol(
                authenticatedRequest.getUserId(), symbolRequest.getSymbol())
                .orElse(0L);
        return ResponseEntity.ok(new TradableQtyResponse(affordable, sellable));
    }
}
