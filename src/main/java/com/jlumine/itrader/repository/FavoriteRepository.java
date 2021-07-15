package com.jlumine.itrader.repository;

import com.jlumine.itrader.model.Favorite;
import com.jlumine.itrader.model.UserStockId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, UserStockId> {
    Optional<Favorite> findByUserIdAndSymbol(long userId, String symbol);

    int countByUserId(long userId);

    List<Favorite> findByUserId(long userId);

    void deleteByUserIdAndSymbol(long userId, String symbol);
}
