package com.jlumine.itrader.model;
import lombok.Data;

@Data
public class Position {
    private long userid;
    private String symbol;
    private long shares;
}
