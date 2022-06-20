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
@IdClass(UserStockId.class)
@Data
public class Favorite {
    @Id
    @Column(name = "user_id", nullable = false)
    private long userId;

    @Id
    @Column(name = "symbol", nullable = false)
    private String symbol;
}
