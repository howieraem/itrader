package com.jlumine.itrader.repository;

import com.jlumine.itrader.model.Sell;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SellRepository extends JpaRepository<Sell, Long> {
}
