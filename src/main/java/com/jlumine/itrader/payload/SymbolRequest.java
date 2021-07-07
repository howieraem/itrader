package com.jlumine.itrader.payload;

import javax.validation.constraints.NotBlank;

public class SymbolRequest {
    @NotBlank
    private String symbol;

    public String getSymbol() {
        return symbol;
    }
}
