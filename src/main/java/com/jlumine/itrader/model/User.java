package com.jlumine.itrader.model;

import lombok.Data;

@Data
public class User {
    private long id;
    private String email;
    private String password;
    private String pin;
}
