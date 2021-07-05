package com.jlumine.itrader.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;


@Entity
@NoArgsConstructor
@AllArgsConstructor
@IdClass(PositionId.class)
@Data
public class Position {
    @Id
    @Column(name = "user_id", nullable = false)
    private long userId;

    @Id
    @Column(name = "symbol", nullable = false)
    private String symbol;

    @Column(name = "quantity", nullable = false)
    private long quantity;

    public Position(PositionId positionId, long quantity) {
        this.userId = positionId.getUserId();
        this.symbol = positionId.getSymbol();
        this.quantity = quantity;
    }

    public long updateQuantity(long qtyChange) {
        this.quantity += qtyChange;
        return this.quantity;
    }
}
