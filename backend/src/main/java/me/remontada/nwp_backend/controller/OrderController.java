package me.remontada.nwp_backend.controller;

import lombok.extern.slf4j.Slf4j;
import me.remontada.nwp_backend.dto.OrderItemRequest;
import me.remontada.nwp_backend.dto.PlaceOrderRequest;
import me.remontada.nwp_backend.dto.ScheduleOrderRequest;
import me.remontada.nwp_backend.model.Order;
import me.remontada.nwp_backend.model.OrderStatus;
import me.remontada.nwp_backend.model.User;
import me.remontada.nwp_backend.service.OrderService;
import me.remontada.nwp_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Slf4j
@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;


    @GetMapping
    @PreAuthorize("hasAuthority('CAN_SEARCH_ORDER')")
    public ResponseEntity<List<Order>> searchOrders(
            @RequestParam(required = false) List<String> status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTo,
            @RequestParam(required = false) Long userId,
            Authentication authentication) {
        ;

        Optional<User> optionalUser = userService.findByEmail(authentication.getName());

        User currentUser = optionalUser.get();

        List<OrderStatus> orderStatuses = null;
        if (status != null && !status.isEmpty()) {
            orderStatuses = status.stream()
                    .map(s -> {
                        try {
                            return OrderStatus.valueOf(s.toUpperCase());
                        } catch (IllegalArgumentException e) {
                            throw new RuntimeException("Invalid status: " + s);
                        }
                    })
                    .toList();
        }

        List<Order> orders = orderService.searchOrders(currentUser, orderStatuses, dateFrom, dateTo, userId);
        return ResponseEntity.ok(orders);
    }


    @PostMapping
    @PreAuthorize("hasAuthority('CAN_PLACE_ORDER')")
    public ResponseEntity<Order> placeOrder(
            @Valid @RequestBody PlaceOrderRequest request,
            Authentication authentication) {


        Optional<User> optionalUser = userService.findByEmail(authentication.getName());
        User currentUser = optionalUser.get();
        Order order = orderService.placeOrder(currentUser, request.getItems());

        return ResponseEntity.ok(order);
    }


    @PostMapping("/schedule")
    @PreAuthorize("hasAuthority('CAN_SCHEDULE_ORDER')")
    public ResponseEntity<Order> scheduleOrder(
            @Valid @RequestBody ScheduleOrderRequest request,
            Authentication authentication) {

       ;

        Optional<User> optionalUser = userService.findByEmail(authentication.getName());

        User currentUser = optionalUser.get();
        Order order = orderService.scheduleOrder(currentUser, request.getItems(), request.getScheduledFor());

        return ResponseEntity.ok(order);
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('CAN_TRACK_ORDER')")
    public ResponseEntity<Order> trackOrder(
            @PathVariable Long id,
            Authentication authentication) {


        Optional<User> optionalUser = userService.findByEmail(authentication.getName());
        User currentUser = optionalUser.get();
        Order order = orderService.trackOrder(id, currentUser);

        return ResponseEntity.ok(order);
    }


    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAuthority('CAN_CANCEL_ORDER')")
    public ResponseEntity<Order> cancelOrder(
            @PathVariable Long id,
            Authentication authentication) {


        Optional<User> optionalUser = userService.findByEmail(authentication.getName());


        User currentUser = optionalUser.get();
        Order order = orderService.cancelOrder(id, currentUser);

        return ResponseEntity.ok(order);
    }





}