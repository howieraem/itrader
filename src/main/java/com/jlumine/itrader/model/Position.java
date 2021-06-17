package com.jlumine.itrader.model;
import lombok.Data;

import javax.persistence.Column;


@Data
public class Position {
    @Column(name = "userid", nullable = false)
    private long userid;

    @Column(name = "symbol", nullable = false)
    private String symbol;

    @Column(name = "shares", nullable = false)
    private long shares;
}
