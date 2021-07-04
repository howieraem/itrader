package com.jlumine.itrader.model;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;


@Entity
@Data
public class Buy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "userId", nullable = false)
    private long userId;

    @Column(name = "symbol", nullable = false)
    private String symbol;

    @Column(name = "shares", nullable = false)
    private long shares;

    @Column(name = "filledPrice", nullable = false)
    private BigDecimal filledPrice;

    @Column(name = "balanceChange", nullable = false)
    private BigDecimal balanceChange;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "time", nullable = false)
    private Date time;
}
