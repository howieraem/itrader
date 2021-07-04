package com.jlumine.itrader.service;


import com.jlumine.itrader.model.*;
import com.jlumine.itrader.repository.BuyRepository;
import com.jlumine.itrader.repository.PositionRepository;
import com.jlumine.itrader.repository.SellRepository;
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
    BuyRepository buyRepository;

    @Autowired
    SellRepository sellRepository;

    @Autowired
    PositionRepository positionRepository;

    @Transactional(rollbackFor=Exception.class)
    public void trade(Long userId, String symbol, long quantity, BigDecimal price) {
        BigDecimal balanceChange = price.multiply(BigDecimal.valueOf(quantity));
        userRepository.updateBalance(userId, balanceChange);
        if (quantity > 0) {
            Buy buy = new Buy();
            buy.setUserId(userId);
            buy.setSymbol(symbol);
            buy.setShares(quantity);
            buy.setFilledPrice(price);
            buy.setBalanceChange(balanceChange.negate());
            buyRepository.save(buy);
        } else {
            Sell sell = new Sell();
            sell.setUserId(userId);
            sell.setSymbol(symbol);
            sell.setShares(-quantity);
            sell.setFilledPrice(price);
            sell.setBalanceChange(balanceChange.negate());
            sellRepository.save(sell);
        }
        PositionId positionId = new PositionId(userId, symbol);
        Position position = positionRepository.findById(positionId)
                .orElse(new Position(positionId, 0));
        position.updateShares(quantity);
        positionRepository.save(position);
    }
}
