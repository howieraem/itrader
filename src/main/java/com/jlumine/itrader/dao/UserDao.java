package com.jlumine.itrader.dao;

import org.apache.ibatis.annotations.Mapper;

import com.jlumine.itrader.model.User;

@Mapper
public interface UserDao {
    User findByName(String name);

    void save(User user);
}
