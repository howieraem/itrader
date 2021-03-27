package com.jlumine.itrader.model;
import lombok.Data;

@Data
public class Position {
    private String username;
    private String symbol;
    private long shares;
}
