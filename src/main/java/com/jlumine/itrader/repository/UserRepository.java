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
    @Query("update User user set user.balance = user.balance - :balance where user.id = :id")
    void updateBalance(@Param("id") Long id, @Param("balance") BigDecimal balanceChange);

    @Query("select user.balance from User user where user.id = :id")
    BigDecimal findBalance(@Param("id") Long id);
}
