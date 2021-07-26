package com.jlumine.itrader.service;


import com.jlumine.itrader.model.*;
import com.jlumine.itrader.repository.PositionRepository;
import com.jlumine.itrader.repository.TradeRepository;
import com.jlumine.itrader.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class TradeService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PositionRepository positionRepository;

    @Autowired
    TradeRepository tradeRepository;

    @Transactional(rollbackFor=Exception.class)
    public void process(Long userId, String symbol, long quantity, BigDecimal price) {
        BigDecimal balanceChange = price.multiply(BigDecimal.valueOf(quantity));
        userRepository.updateBalance(userId, balanceChange);
        BigDecimal newBalance = userRepository.findBalance(userId);

        Trade trade = new Trade();
        trade.setUserId(userId);
        trade.setSymbol(symbol);
        if (quantity > 0) {
            trade.setBuy(true);
            trade.setQuantity(quantity);
        } else {
            trade.setBuy(false);
            trade.setQuantity(-quantity);
        }
        trade.setPrice(price);
        trade.setCashAfter(newBalance);
        tradeRepository.save(trade);

        UserStockId userStockId = new UserStockId(userId, symbol);
        Position position = positionRepository.findById(userStockId)
                .orElse(new Position(userStockId));
        position.updateQuantity(quantity, balanceChange);
        if (position.getQuantity() != 0) {
            positionRepository.save(position);
        } else {
            positionRepository.deleteById(userStockId);
        }
    }

    public Long getAffordableQty(Long userId, BigDecimal price) {
        BigDecimal balance = userRepository.findBalance(userId);
        return balance.divide(price, RoundingMode.FLOOR).longValue();
    }
}
