package com.jlumine.itrader.model;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Data
public class Trade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "user_id", nullable = false)
    private long userId;

    @Column(name = "symbol", nullable = false)
    private String symbol;

    @Column(name = "is_buy", nullable = false)
    private boolean isBuy;

    @Column(name = "quantity", nullable = false)
    private long quantity;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "cash_after", nullable = false)
    private BigDecimal cashAfter;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "time", nullable = false)
    private Date time;
}
