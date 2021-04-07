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
        String username = user.getUsername();
        if (checkUsernameInvalid(username)) {
            throw new RuntimeException(
                    "Username can be neither empty nor contain characters other than letters and digits.");
        }
        if (checkPasswordInvalid(user.getPassword())) {
            throw new RuntimeException(
                    "The password entered either is less than 6 characters long or contains spaces.");
        }
        User userInDB = userDao.findByName(username);
        if (userInDB != null) {
            if (StringUtils.equals(userInDB.getPassword(), user.getPassword())) {
                return userInDB;
            }
            throw new RuntimeException(String.format("Incorrect password entered for username %s.", username));
        }
        throw new RuntimeException(String.format("Username \"%s\" does not exist.", username));
    }

    @Override
    public void signUp(User user) {
        String username = user.getUsername();
        if (checkUsernameInvalid(username)) {
            throw new RuntimeException(
                    "Username can be neither empty nor contain characters other than letters and digits.");
        }
        if (checkPasswordInvalid(user.getPassword())) {
            throw new RuntimeException(
                    "The password must be at least 6 characters long without spaces.");
        }
        if (userDao.findByName(username) != null) {
            throw new RuntimeException("Username has already been registered. Please modify.");
        }
        userDao.save(user);
//        System.out.println(user.getId());
        userDao.initInfo(user);
    }

    private static boolean checkUsernameInvalid(String username) {
        if (username == null || username.trim().isEmpty()) {
            return true;
        }
        Pattern p = Pattern.compile("[^A-Za-z0-9]");
        Matcher m = p.matcher(username);
        return m.find();
    }

    private static boolean checkPasswordInvalid(String password) {
        return password.length() < 6 || password.contains(" ");
    }
}

// UserServiceImpl
