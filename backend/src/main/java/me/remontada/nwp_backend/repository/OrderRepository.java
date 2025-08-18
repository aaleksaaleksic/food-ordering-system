package me.remontada.nwp_backend.repository;

import me.remontada.nwp_backend.model.Order;
import me.remontada.nwp_backend.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {


    List<Order> findByCreatedByIdOrderByCreatedAtDesc(Long userId);


    List<Order> findAllByOrderByCreatedAtDesc();


    @Query("SELECT COUNT(o) FROM Order o WHERE o.status IN (:statuses) AND o.active = true")
    long countByStatusInAndActiveTrue(@Param("statuses") List<OrderStatus> statuses);


    @Query("SELECT o FROM Order o WHERE o.createdBy.id = :userId " +
            "AND (COALESCE(:statuses, NULL) IS NULL OR o.status IN :statuses) " +
            "AND (COALESCE(:dateFrom, NULL) IS NULL OR o.createdAt >= :dateFrom) " +
            "AND (COALESCE(:dateTo, NULL) IS NULL OR o.createdAt <= :dateTo) " +
            "ORDER BY o.createdAt DESC")
    List<Order> searchUserOrders(@Param("userId") Long userId,
                                 @Param("statuses") List<OrderStatus> statuses,
                                 @Param("dateFrom") LocalDateTime dateFrom,
                                 @Param("dateTo") LocalDateTime dateTo);


    @Query("SELECT o FROM Order o WHERE " +
            "(COALESCE(:userId, NULL) IS NULL OR o.createdBy.id = :userId) " +
            "AND (COALESCE(:statuses, NULL) IS NULL OR o.status IN :statuses) " +
            "AND (COALESCE(:dateFrom, NULL) IS NULL OR o.createdAt >= :dateFrom) " +
            "AND (COALESCE(:dateTo, NULL) IS NULL OR o.createdAt <= :dateTo) " +
            "ORDER BY o.createdAt DESC")
    List<Order> searchAllOrders(@Param("userId") Long userId,
                                @Param("statuses") List<OrderStatus> statuses,
                                @Param("dateFrom") LocalDateTime dateFrom,
                                @Param("dateTo") LocalDateTime dateTo);


    @Query("SELECT o FROM Order o WHERE o.scheduledFor IS NOT NULL " +
            "AND o.scheduledFor <= :currentTime AND o.status = :status")
    List<Order> findScheduledOrdersReadyForProcessing(@Param("currentTime") LocalDateTime currentTime,
                                                      @Param("status") OrderStatus status);


    @Query("SELECT o FROM Order o WHERE o.id = :orderId AND o.status = :status")
    Order findCancellableOrder(@Param("orderId") Long orderId, @Param("status") OrderStatus status);
}