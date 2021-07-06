package com.jlumine.itrader.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import java.math.BigDecimal;


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

    @Column(name = "holding_cost", nullable = false)
    private BigDecimal holdingCost;

    public Position(PositionId positionId) {
        this.userId = positionId.getUserId();
        this.symbol = positionId.getSymbol();
        this.quantity = 0;
        this.holdingCost = BigDecimal.ZERO;
    }

    public void updateQuantity(long qtyChange, BigDecimal balanceChange) {
        quantity += qtyChange;
        if (quantity != 0) {
            holdingCost = holdingCost.add(balanceChange);
        }
//        else {
//            holdingCost = BigDecimal.ZERO;
//        }
    }
}
