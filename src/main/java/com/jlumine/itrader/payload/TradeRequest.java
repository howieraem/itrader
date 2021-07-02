package com.jlumine.itrader.payload;

import javax.validation.constraints.NotBlank;

public class TradeRequest {
    @NotBlank
    private String symbol;

    @NotBlank
    private String amount;

    public String getSymbol() {
        return symbol;
    }

    public String getAmount() {
        return amount;
    }
}
