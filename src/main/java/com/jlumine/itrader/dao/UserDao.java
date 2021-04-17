package com.jlumine.itrader.dao;

import org.apache.ibatis.annotations.Mapper;

import com.jlumine.itrader.model.User;

@Mapper
public interface UserDao {
    User findByEmail(String name);

    long save(User user);

    void initInfo(User user);
}
