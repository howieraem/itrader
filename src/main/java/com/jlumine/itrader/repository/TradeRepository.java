package com.jlumine.itrader.repository;

import com.jlumine.itrader.dto.TradeDTO;
import com.jlumine.itrader.model.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TradeRepository extends JpaRepository<Trade, Long> {
    @Query("select new com.jlumine.itrader.dto.TradeDTO(tr.symbol, tr.quantity, tr.isBuy, tr.price, tr.time) " +
            "from Trade tr where tr.userId = :userId " +
            "order by tr.time desc ")
    List<TradeDTO> findByUserId(@Param("userId") long userId);
}
