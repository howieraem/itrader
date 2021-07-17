package com.jlumine.itrader.repository;

import com.jlumine.itrader.model.Favorite;
import com.jlumine.itrader.model.UserStockId;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, UserStockId> {
    boolean existsByUserIdAndSymbol(Long userId, String symbol);

    void deleteByUserIdAndSymbol(Long userId, String symbol);

    int countByUserId(Long userId);

    List<Favorite> findByUserId(Long userId);

    List<Favorite> findByUserId(Long userId, Pageable pageable);

    void deleteByUserId(Long userId);
}
