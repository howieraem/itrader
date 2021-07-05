package com.jlumine.itrader.service;


import com.jlumine.itrader.model.*;
import com.jlumine.itrader.repository.PositionRepository;
import com.jlumine.itrader.repository.TradeRepository;
import com.jlumine.itrader.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

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
        tradeRepository.save(trade);

        PositionId positionId = new PositionId(userId, symbol);
        Position position = positionRepository.findById(positionId)
                .orElse(new Position(positionId, 0));
        if (position.updateQuantity(quantity) != 0) {
            positionRepository.save(position);
        } else {
            positionRepository.deleteById(positionId);
        }
    }
}
