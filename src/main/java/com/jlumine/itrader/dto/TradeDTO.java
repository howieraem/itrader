package com.jlumine.itrader.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;


@Data
@NoArgsConstructor
@Builder(toBuilder = true)
@AllArgsConstructor
public class TradeDTO {
    private Date time;
    private String symbol;
    private long quantity;
    private boolean isBuy;
    private BigDecimal price;
    private BigDecimal cashAfter;
}
