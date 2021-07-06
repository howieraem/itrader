package com.jlumine.itrader.service;


import com.jlumine.itrader.model.*;
import com.jlumine.itrader.repository.PositionRepository;
import com.jlumine.itrader.repository.TradeRepository;
import com.jlumine.itrader.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

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
        // TODO affordability check
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

        PositionId positionId = new PositionId(userId, symbol);
        Position position = positionRepository.findById(positionId)
                .orElse(new Position(positionId));
        position.updateQuantity(quantity, balanceChange);
        if (position.getQuantity() != 0) {
            positionRepository.save(position);
        } else {
            positionRepository.deleteById(positionId);
        }
    }
}
