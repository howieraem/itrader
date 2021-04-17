package com.jlumine.itrader.service;


import com.jlumine.itrader.dao.UserDao;
import com.jlumine.itrader.model.User;

import com.alibaba.druid.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Transactional
public class UserServiceImpl implements UserService {
    @Autowired
    private UserDao userDao;

    @Override
    public User signIn(User user) {
        String email = user.getEmail();
        if (checkEmailInvalid(email)) {
            throw new RuntimeException("Email address format is invalid.");
        }
        if (checkPasswordInvalid(user.getPassword())) {
            throw new RuntimeException(
                    "The password entered either is less than 6 characters long or contains spaces.");
        }
        if (checkPinInvalid(user.getPin())) {
            throw new RuntimeException("The pin must be 4 digits.");
        }
        User userInDB = userDao.findByEmail(email);
        if (userInDB != null) {
            if (StringUtils.equals(userInDB.getPassword(), user.getPassword()) &&
                    StringUtils.equals(userInDB.getPin(), user.getPin())) {
                return userInDB;
            }
            throw new RuntimeException(String.format("Incorrect password or pin entered for email %s.", email));
        }
        throw new RuntimeException(String.format("Email \"%s\" does not exist.", email));
    }

    @Override
    public void signUp(User user) {
        String email = user.getEmail();
        if (checkEmailInvalid(email)) {
            throw new RuntimeException(
                    "Email can be neither empty nor contain characters other than letters and digits.");
        }
        if (checkPasswordInvalid(user.getPassword())) {
            throw new RuntimeException(
                    "The password must be at least 6 characters long without spaces.");
        }
        if (checkPinInvalid(user.getPin())) {
            throw new RuntimeException("The pin must be 4 digits.");
        }
        if (userDao.findByEmail(email) != null) {
            throw new RuntimeException("Email has already been registered. Please use another one or sign in.");
        }
        userDao.save(user);
        userDao.initInfo(user);
    }

    private static boolean checkEmailInvalid(String email) {
        if (email == null || email.trim().isEmpty()) {
            return true;
        }
        Pattern p = Pattern.compile("[^A-Za-z0-9]");
        Matcher m = p.matcher(email);
        return m.find();
    }

    private static boolean checkPasswordInvalid(String password) {
        return password.length() < 6 || password.contains(" ");
    }

    private static boolean checkPinInvalid(String pin) {
        return !pin.matches("[0-9]+") || pin.length() != 4;
    }
}

// UserServiceImpl
