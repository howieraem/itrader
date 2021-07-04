package com.jlumine.itrader.repository;

import com.jlumine.itrader.model.Position;
import com.jlumine.itrader.model.PositionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PositionRepository extends JpaRepository<Position, PositionId> {
    @Query("select position from Position position where position.userId = :userId")
    List<Position> findByUserId(long userId);
}
