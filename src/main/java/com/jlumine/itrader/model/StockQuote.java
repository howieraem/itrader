package com.jlumine.itrader.model;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class StockQuote {
//    private String currency;
    private BigDecimal price;
    private BigDecimal ask;
    private Long askSize;
    private BigDecimal bid;
    private Long bidSize;
}
