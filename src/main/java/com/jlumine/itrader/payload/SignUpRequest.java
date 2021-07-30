package com.jlumine.itrader.payload;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;


public class SignUpRequest {
    @NotBlank(message = "Email cannot be blank!")
    @Email(message = "Email address is invalid.")
    private String email;

    @NotBlank(message = "Password cannot be blank!")
    @Size(min = 6, max = 20, message = "Password must be 6-20 characters long!")
    private String password;

//    @NotBlank
//    private String pin;

    @NotBlank(message = "Username cannot be blank!")
    @Size(min = 3, message = "Username must be at least 3 characters long!")
    private String username;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

//    public String getPin() {
//        return pin;
//    }
//
//    public void setPin(String pin) {
//        this.pin = pin;
//    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
