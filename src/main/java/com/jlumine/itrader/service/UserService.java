package com.jlumine.itrader.service;

import com.jlumine.itrader.model.User;

public interface UserService {
    void sign_up(User user);

    User sign_in(User user);
}

// UserService
