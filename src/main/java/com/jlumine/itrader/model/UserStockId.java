package com.jlumine.itrader.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserStockId implements Serializable {
    @NotNull
    private long userId;

    @NotNull
    private String symbol;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserStockId userStockId = (UserStockId) o;
        return userId == userStockId.userId &&
                symbol.equals(userStockId.symbol);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, symbol);
    }
}
