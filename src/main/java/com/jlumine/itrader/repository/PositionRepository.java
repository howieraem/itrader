package com.jlumine.itrader.repository;

import com.jlumine.itrader.dto.PositionDTO;
import com.jlumine.itrader.model.Position;
import com.jlumine.itrader.model.PositionId;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PositionRepository extends JpaRepository<Position, PositionId> {
    @Query("select new com.jlumine.itrader.dto.PositionDTO(p.symbol, p.quantity, p.holdingCost) " +
            "from Position p where p.userId = :userId " +
            "order by p.symbol asc ")
    List<PositionDTO> findByUserId(@Param("userId") Long userId);

    @Query("select new com.jlumine.itrader.dto.PositionDTO(p.symbol, p.quantity, p.holdingCost) " +
            "from Position p where p.userId = :userId " +
            "order by p.symbol asc ")
    List<PositionDTO> findByUserId(@Param("userId") Long userId, Pageable pageable);

    Boolean existsByUserIdAndSymbol(long userId, String symbol);

    @Query("select p.quantity " +
            "from Position p " +
            "where p.userId = :userId " +
            "and p.symbol = :symbol ")
    Optional<Long> findFirstQuantityByUserIdAndSymbol(@Param("userId") Long userId, @Param("symbol") String symbol);

    long countByUserId(long userId);
}
