package com.jlumine.itrader.repository;

import com.jlumine.itrader.model.Favorite;
import com.jlumine.itrader.model.UserStockId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, UserStockId> {
    Optional<Favorite> findByUserIdAndSymbol(Long userId, String symbol);

    int countByUserId(Long userId);

    @Transactional(rollbackFor = Exception.class)
    List<Favorite> findByUserId(Long userId);

    @Transactional(rollbackFor = Exception.class)
    void deleteByUserId(Long userId);
}
