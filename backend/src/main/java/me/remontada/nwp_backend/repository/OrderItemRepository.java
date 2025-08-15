package me.remontada.nwp_backend.repository;

import me.remontada.nwp_backend.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;


@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {


    List<OrderItem> findByOrderIdOrderById(Long orderId);


    List<OrderItem> findByDishId(Long dishId);


    @Query("SELECT SUM(oi.priceAtTime * oi.quantity) FROM OrderItem oi WHERE oi.order.id = :orderId")
    BigDecimal calculateOrderTotal(@Param("orderId") Long orderId);


    void deleteByOrderId(Long orderId);
}