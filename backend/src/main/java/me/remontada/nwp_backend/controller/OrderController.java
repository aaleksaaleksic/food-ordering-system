package me.remontada.nwp_backend.controller;

import lombok.extern.slf4j.Slf4j;
import me.remontada.nwp_backend.dto.PlaceOrderRequest;
import me.remontada.nwp_backend.dto.ScheduleOrderRequest;
import me.remontada.nwp_backend.dto.response.OrderResponseDTO;
import me.remontada.nwp_backend.mapper.OrderMapper;
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


@Slf4j
@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {


    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @Autowired
    private OrderMapper orderMapper;

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            throw new RuntimeException("User not authenticated");
        }
        return (User) authentication.getPrincipal();
    }


    @GetMapping
    @PreAuthorize("hasAuthority('CAN_SEARCH_ORDER')")
    public ResponseEntity<List<OrderResponseDTO>> searchOrders(
            @RequestParam(required = false) List<String> status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTo,
            @RequestParam(required = false) Long userId,
            Authentication authentication) {
        ;


        User currentUser = getCurrentUser(authentication);

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
        List<OrderResponseDTO> orderDTOs = orderMapper.toResponseDTOs(orders);
        return ResponseEntity.ok(orderDTOs);
    }


    @PostMapping
    @PreAuthorize("hasAuthority('CAN_PLACE_ORDER')")
    public ResponseEntity<OrderResponseDTO> placeOrder(
            @Valid @RequestBody PlaceOrderRequest request,
            Authentication authentication) {


        User currentUser = getCurrentUser(authentication);

        Order order = orderService.placeOrder(currentUser, request.getItems());
        OrderResponseDTO orderDTO = orderMapper.toResponseDTO(order);

        return ResponseEntity.ok(orderDTO);
    }


    @PostMapping("/schedule")
    @PreAuthorize("hasAuthority('CAN_SCHEDULE_ORDER')")
    public ResponseEntity<OrderResponseDTO> scheduleOrder(
            @Valid @RequestBody ScheduleOrderRequest request,
            Authentication authentication) {

       ;

        User currentUser = getCurrentUser(authentication);

        Order order = orderService.scheduleOrder(currentUser, request.getItems(), request.getScheduledFor());

        OrderResponseDTO orderResponseDTO = orderMapper.toResponseDTO(order);

        return ResponseEntity.ok(orderResponseDTO);
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('CAN_TRACK_ORDER')")
    public ResponseEntity<OrderResponseDTO> trackOrder(
            @PathVariable Long id,
            Authentication authentication) {


        User currentUser = getCurrentUser(authentication);

        Order order = orderService.trackOrder(id, currentUser);

        OrderResponseDTO orderDTO = orderMapper.toResponseDTO(order);

        return ResponseEntity.ok(orderDTO);
    }


    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAuthority('CAN_CANCEL_ORDER')")
    public ResponseEntity<OrderResponseDTO> cancelOrder(
            @PathVariable Long id,
            Authentication authentication) {


        User currentUser = getCurrentUser(authentication);


        Order order = orderService.cancelOrder(id, currentUser);

        OrderResponseDTO orderDTO = orderMapper.toResponseDTO(order);

        return ResponseEntity.ok(orderDTO);
    }





}