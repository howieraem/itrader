package com.jlumine.itrader.model;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
public class PositionId implements Serializable {
    private long userId;
    private String symbol;

    public PositionId() {}

    public PositionId(long userId, String symbol) {
        this.userId = userId;
        this.symbol = symbol;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PositionId positionId = (PositionId) o;
        return userId == positionId.userId &&
                symbol.equals(positionId.symbol);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, symbol);
    }
}
