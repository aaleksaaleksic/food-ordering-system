package me.remontada.nwp_backend.repository;

import me.remontada.nwp_backend.model.OrderStatusTransition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface OrderStatusTransitionRepository extends JpaRepository<OrderStatusTransition, Long> {


    @Query("SELECT t FROM OrderStatusTransition t WHERE t.processed = false " +
            "AND t.scheduledFor <= :currentTime ORDER BY t.scheduledFor ASC")
    List<OrderStatusTransition> findPendingTransitions(@Param("currentTime") LocalDateTime currentTime);


    void deleteByOrderId(Long orderId);


    List<OrderStatusTransition> findByOrderIdAndProcessedFalse(Long orderId);
}