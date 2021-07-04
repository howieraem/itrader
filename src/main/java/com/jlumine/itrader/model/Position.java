package com.jlumine.itrader.model;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;


@Entity
@IdClass(PositionId.class)
@Data
public class Position {
    @Id
    @Column(name = "userId", nullable = false)
    private long userId;

    @Id
    @Column(name = "symbol", nullable = false)
    private String symbol;

    @Column(name = "shares", nullable = false)
    private long shares;

    public Position() {}

    public Position(PositionId positionId, long shares) {
        this.userId = positionId.getUserId();
        this.symbol = positionId.getSymbol();
        this.shares = shares;
    }

    public Position(long userId, String symbol, long shares) {
        this.userId = userId;
        this.symbol = symbol;
        this.shares = shares;
    }

    public void updateShares(long qtyChange) {
        this.shares += qtyChange;
    }
}
