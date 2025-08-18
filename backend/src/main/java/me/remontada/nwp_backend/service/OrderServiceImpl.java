package me.remontada.nwp_backend.service;

import me.remontada.nwp_backend.dto.OrderItemRequest;
import me.remontada.nwp_backend.repository.OrderStatusTransitionRepository;
import lombok.extern.slf4j.Slf4j;
import me.remontada.nwp_backend.model.*;
import me.remontada.nwp_backend.repository.DishRepository;
import me.remontada.nwp_backend.repository.ErrorMessageRepository;
import me.remontada.nwp_backend.repository.OrderRepository;
import me.remontada.nwp_backend.util.PermissionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;


@Slf4j
@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private static final int MAX_SIMULTANEOUS_ORDERS = 3;
    private static final List<OrderStatus> ACTIVE_STATUSES = Arrays.asList(
            OrderStatus.PREPARING, OrderStatus.IN_DELIVERY
    );

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private DishRepository dishRepository;

    @Autowired
    private ErrorMessageRepository errorMessageRepository;

    @Autowired
    private OrderStatusTransitionRepository transitionRepository;

    @Override
    public List<Order> searchOrders(User user, List<OrderStatus> statuses,
                                    LocalDateTime dateFrom, LocalDateTime dateTo, Long userId) {


        boolean isAdmin = PermissionUtils.isAdmin(user);

        if (isAdmin) {
            return orderRepository.searchAllOrders(userId, statuses, dateFrom, dateTo);
        } else {
            return orderRepository.searchUserOrders(user.getId(), statuses, dateFrom, dateTo);
        }
    }

    @Override
    public Order placeOrder(User user, List<OrderItemRequest> orderItems) {

        if (!canCreateNewOrder()) {
            String errorMsg = "Maximum number of simultaneous orders (3) exceeded";

            ErrorMessage error = ErrorMessage.forImmediateOrderFailure(user, errorMsg);
            errorMessageRepository.save(error);

            throw new RuntimeException(errorMsg);
        }

        Order order = new Order();
        order.setCreatedBy(user);
        order.setStatus(OrderStatus.ORDERED);
        order.setActive(true);
        order.setCreatedAt(LocalDateTime.now());

        List<OrderItem> items = createOrderItems(order, orderItems);
        order.setItems(items);

        Order savedOrder = orderRepository.save(order);


        scheduleStatusTransition(savedOrder.getId(), OrderStatus.PREPARING, 10);

        return savedOrder;
    }

    @Override
    public Order scheduleOrder(User user, List<OrderItemRequest> orderItems, LocalDateTime scheduledFor) {

        if (scheduledFor.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot schedule order in the past");
        }

        Order order = new Order();
        order.setCreatedBy(user);
        order.setStatus(OrderStatus.ORDERED);
        order.setActive(false);
        order.setCreatedAt(LocalDateTime.now());
        order.setScheduledFor(scheduledFor);

        List<OrderItem> items = createOrderItems(order, orderItems);
        order.setItems(items);

        Order savedOrder = orderRepository.save(order);


        return savedOrder;
    }

    @Override
    public Order cancelOrder(Long orderId, User user) {
        Order order = orderRepository.findCancellableOrder(orderId, OrderStatus.ORDERED);
        if (order == null) {
            throw new RuntimeException("Order not found or cannot be canceled");
        }

        boolean isAdmin = PermissionUtils.isAdmin(user);
        boolean isOwner = order.getCreatedBy().getId().equals(user.getId());

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("You can only cancel your own orders");
        }

        order.setStatus(OrderStatus.CANCELED);
        order.setActive(false);

        Order savedOrder = orderRepository.save(order);

        return savedOrder;
    }

    @Override
    public Order trackOrder(Long orderId, User user) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new RuntimeException("Order not found");
        }

        Order order = orderOpt.get();

        boolean isAdmin = PermissionUtils.isAdmin(user);
        boolean isOwner = order.getCreatedBy().getId().equals(user.getId());

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("You can only track your own orders");
        }

        return order;
    }

    @Override
    public boolean canCreateNewOrder() {
        long activeOrdersCount = orderRepository.countByStatusInAndActiveTrue(ACTIVE_STATUSES);
        return activeOrdersCount < MAX_SIMULTANEOUS_ORDERS;
    }

    @Override
    public void processScheduledOrders() {

        List<Order> scheduledOrders = orderRepository.findScheduledOrdersReadyForProcessing(
                LocalDateTime.now(), OrderStatus.ORDERED);

        for (Order order : scheduledOrders) {
            try {
                if (canCreateNewOrder()) {
                    order.setActive(true);
                    order.setScheduledFor(null);
                    orderRepository.save(order);


                    scheduleStatusTransition(order.getId(), OrderStatus.PREPARING, 10);
                } else {
                    String errorMsg = "Maximum number of simultaneous orders (3) exceeded";
                    ErrorMessage error = ErrorMessage.forScheduledOrderFailure(
                            order.getId(), order.getCreatedBy(), errorMsg);
                    errorMessageRepository.save(error);

                }
            } catch (Exception e) {

                ErrorMessage error = ErrorMessage.forScheduledOrderFailure(
                        order.getId(), order.getCreatedBy(), e.getMessage());
                errorMessageRepository.save(error);
            }
        }
    }

    @Override
    public void processStatusTransitions() {
        List<OrderStatusTransition> pendingTransitions =
                transitionRepository.findPendingTransitions(LocalDateTime.now());

        for (OrderStatusTransition transition : pendingTransitions) {
            try {
                Optional<Order> orderOpt = orderRepository.findById(transition.getOrderId());
                if (orderOpt.isPresent()) {
                    Order order = orderOpt.get();
                    order.setStatus(transition.getTargetStatus());
                    orderRepository.save(order);

                    transition.setProcessed(true);
                    transitionRepository.save(transition);


                    OrderStatus nextStatus = getNextStatus(transition.getTargetStatus());
                    if (nextStatus != null) {
                        int delay = getDelayForStatus(nextStatus);
                        scheduleStatusTransition(order.getId(), nextStatus, delay);
                    }
                }
            } catch (Exception e) {
            }
        }
    }

    @Override
    public void advanceOrderStatus(Long orderId) {
        try {
            Optional<Order> orderOpt = orderRepository.findById(orderId);
            if (orderOpt.isEmpty()) {
                return;
            }

            Order order = orderOpt.get();
            OrderStatus nextStatus = getNextStatus(order.getStatus());

            if (nextStatus != null) {
                order.setStatus(nextStatus);
                orderRepository.save(order);

                int delay = getDelayForStatus(nextStatus);

                if (delay > 0) {
                    scheduleStatusTransition(orderId, getNextStatus(nextStatus), delay);
                }
            }
        } catch (Exception e) {
            log.error("Error advancing status for order {}: {}", orderId, e.getMessage());
        }
    }

    private List<OrderItem> createOrderItems(Order order, List<OrderItemRequest> orderItemDtos) {
        return orderItemDtos.stream().map(dto -> {
            Dish dish = dishRepository.findById(dto.getDishId())
                    .orElseThrow(() -> new RuntimeException("Dish not found: " + dto.getDishId()));

            if (!dish.isAvailable()) {
                throw new RuntimeException("Dish is not available: " + dish.getName());
            }

            return new OrderItem(order, dish, dto.getQuantity());
        }).toList();
    }


    private OrderStatus getNextStatus(OrderStatus currentStatus) {
        return switch (currentStatus) {
            case ORDERED -> OrderStatus.PREPARING;
            case PREPARING -> OrderStatus.IN_DELIVERY;
            case IN_DELIVERY -> OrderStatus.DELIVERED;
            default -> null;
        };
    }


    private int getDelayForStatus(OrderStatus status) {
        return switch (status) {
            case PREPARING -> 15;
            case IN_DELIVERY -> 20;
            default -> 0;
        };
    }



    private void scheduleStatusTransition(Long orderId, OrderStatus targetStatus, int delaySeconds) {
        LocalDateTime scheduledTime = LocalDateTime.now().plusSeconds(delaySeconds);
        OrderStatusTransition transition = new OrderStatusTransition(orderId, targetStatus, scheduledTime);
        transitionRepository.save(transition);
        log.info("Scheduled status transition for order {} to {} at {}", orderId, targetStatus, scheduledTime);
    }




}