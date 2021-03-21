package com.jlumine.itrader.service;

import com.alibaba.druid.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jlumine.itrader.dao.UserDao;
import com.jlumine.itrader.model.User;

@Service
@Transactional
public class UserServiceImpl implements UserService {
    @Autowired
    private UserDao userDao;

    @Override
    public User sign_in(User user) {
        String username = user.getUsername();
        User userInDB = userDao.findByName(username);
        if (userInDB != null) {
            if (StringUtils.equals(userInDB.getPassword(), user.getPassword())) {
                return userInDB;
            }
            throw new RuntimeException(String.format("Incorrect password entered for username %s.", username));
        }
        throw new RuntimeException(String.format("Username %s does not exist.", username));
    }

    @Override
    public void sign_up(User user) {
        if (userDao.findByName(user.getUsername()) != null) {
            throw new RuntimeException("Username has already been registered. Please modify.");
        }
        userDao.save(user);
    }
}

// UserServiceImpl
