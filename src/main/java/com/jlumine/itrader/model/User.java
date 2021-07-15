package com.jlumine.itrader.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Email;
import java.math.BigDecimal;
//import javax.validation.constraints.NotNull;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Email
    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

//    @Column(name = "pin", nullable = false)
//    private String pin;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "balance", nullable = false)
    private BigDecimal balance;

    @Column(name = "avatar")
    private String avatar;

    public User(String email, String password, String username) {
        this.email = email;
        this.password = password;
//        this.pin = pin;
        this.username = username;
        this.balance = new BigDecimal(10000);
    }
}
