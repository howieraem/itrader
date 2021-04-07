package com.jlumine.itrader.model;
import lombok.Data;

@Data
public class Sell {
    private long userid;
    private String symbol;
    private long shares;
    private String time;    // TODO timestamp
}
