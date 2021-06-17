package com.jlumine.itrader.model;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
@Data
public class Profile {
    @Id
    private long userid;

    @Column(name = "balance", nullable = false)
    private double balance;

    @Column(name = "avatar")
    private String avatar;

    @Column(name = "nickname")
    private String nickname;
}
