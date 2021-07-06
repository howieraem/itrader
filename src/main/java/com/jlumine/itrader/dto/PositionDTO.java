package com.jlumine.itrader.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@Builder(toBuilder = true)
@AllArgsConstructor
public class PositionDTO {
    private String symbol;
    private long quantity;
    private BigDecimal holdingCost;
}
