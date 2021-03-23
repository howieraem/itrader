package com.jlumine.itrader.service;

import com.jlumine.itrader.model.User;

public interface UserService {
    void signUp(User user);

    User signIn(User user);
}

// UserService
