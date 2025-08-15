package me.remontada.nwp_backend.service;

import me.remontada.nwp_backend.dto.OrderItemRequest;
import me.remontada.nwp_backend.model.Order;
import me.remontada.nwp_backend.model.OrderStatus;
import me.remontada.nwp_backend.model.User;

import java.time.LocalDateTime;
import java.util.List;


public interface OrderService {


    List<Order> searchOrders(User user, List<OrderStatus> statuses,
                             LocalDateTime dateFrom, LocalDateTime dateTo, Long userId);


    Order placeOrder(User user, List<OrderItemRequest> dishIds);


    Order scheduleOrder(User user, List<OrderItemRequest> dishIds, LocalDateTime scheduledFor);


    Order cancelOrder(Long orderId, User user);


    Order trackOrder(Long orderId, User user);


    boolean canCreateNewOrder();


    void processScheduledOrders();


    void advanceOrderStatus(Long orderId);

    void processStatusTransitions();



}