package com.jlumine.itrader.model;
import lombok.Data;

@Data
public class Transaction {
    private String username;
    private String symbol;
    private long shares;
    private String time;    // TODO timestamp
    private String type;
}
