package com.jlumine.itrader.model;
import lombok.Data;

@Data
public class Stock {
    private String symbol;
    private String name;
    private String country;
    private String ipoYear;
    private String sector;
    private String industry;
    private String market;
}
