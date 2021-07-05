package com.jlumine.itrader.repository;

import com.jlumine.itrader.dto.PositionDTO;
import com.jlumine.itrader.model.Position;
import com.jlumine.itrader.model.PositionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PositionRepository extends JpaRepository<Position, PositionId> {
    @Query("select new com.jlumine.itrader.dto.PositionDTO(p.symbol, p.quantity) " +
            "from Position p where p.userId = :userId " + "" +
            "order by p.symbol ")
    List<PositionDTO> findByUserId(@Param("userId") long userId);
}
