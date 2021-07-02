package com.jlumine.itrader.service;

import com.jlumine.itrader.exception.ResourceNotFoundException;
import com.jlumine.itrader.model.User;
import com.jlumine.itrader.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class BalanceUpdateService {
    @Autowired
    UserRepository userRepository;

    @Transactional(rollbackFor=Exception.class)
    public void updateAfterTrade(Long userId, BigDecimal amount) {
        User userInDB = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        userInDB.setBalance(userInDB.getBalance().subtract(amount));
        userRepository.save(userInDB);
    }
}
