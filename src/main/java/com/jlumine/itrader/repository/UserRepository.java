package com.jlumine.itrader.repository;

import com.jlumine.itrader.model.User;

import java.math.BigDecimal;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    @Modifying
    @Query("update User user set user.balance = 10000 where user.id = :id")
    void resetBalance(@Param("id") Long id);

    @Modifying
    @Query("update User user set user.balance = user.balance - :balanceChange where user.id = :id")
    void updateBalance(@Param("id") Long id, @Param("balanceChange") BigDecimal balanceChange);

    @Query("select user.balance from User user where user.id = :id")
    BigDecimal findBalance(@Param("id") Long id);

    @Modifying
    @Query("update User user set user.username = :username where user.id = :id")
    void updateUsername(@Param("id") Long id, @Param("username") String username);

    @Modifying
    @Query("update User user set user.password = :pwd where user.id = :id")
    void updatePwd(@Param("id") Long id, @Param("pwd") String pwd);

    @Modifying
    @Query("update User user set user.avatar = :avatar where user.id = :id")
    void updateAvatar(@Param("id") Long id, @Param("avatar") String avatar);
}
