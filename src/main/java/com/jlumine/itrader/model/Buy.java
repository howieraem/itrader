package com.jlumine.itrader.model;
import lombok.Data;

import javax.persistence.*;


@Entity
@Data
public class Buy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "userid", nullable = false)
    private long userid;

    @Column(name = "symbol", nullable = false)
    private String symbol;

    @Column(name = "shares", nullable = false)
    private long shares;

    @Column(name = "time", nullable = false)
    private String time;
}
