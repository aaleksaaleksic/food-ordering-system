package me.remontada.nwp_backend.mapper;

import me.remontada.nwp_backend.dto.response.OrderResponseDTO;
import me.remontada.nwp_backend.dto.response.OrderItemResponseDTO;
import me.remontada.nwp_backend.model.Order;
import me.remontada.nwp_backend.model.OrderStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;


@Component
public class OrderMapper {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private OrderItemMapper orderItemMapper;


    public OrderResponseDTO toResponseDTO(Order order) {
        if (order == null) {
            return null;
        }

        OrderResponseDTO dto = new OrderResponseDTO();

        dto.setId(order.getId());
        dto.setStatus(order.getStatus());
        dto.setActive(order.getActive());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setScheduledFor(order.getScheduledFor());

        if (order.getCreatedBy() != null) {
            dto.setCreatedBy(userMapper.toSimpleDTO(order.getCreatedBy()));
        }

        if (order.getItems() != null && !order.getItems().isEmpty()) {
            List<OrderItemResponseDTO> itemDTOs = order.getItems().stream()
                    .map(orderItemMapper::toResponseDTO)
                    .collect(Collectors.toList());
            dto.setItems(itemDTOs);

            // total number of items
            dto.setTotalItems(itemDTOs.stream()
                    .mapToInt(OrderItemResponseDTO::getQuantity)
                    .sum());
        } else {
            dto.setTotalItems(0);
        }

        // Computed field
        dto.setStatusDisplayName(getStatusDisplayName(order.getStatus()));

        return dto;
    }


    public List<OrderResponseDTO> toResponseDTOs(List<Order> orders) {
        return orders.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }


    private String getStatusDisplayName(OrderStatus status) {
        return switch (status) {
            case ORDERED -> "Order Placed";
            case PREPARING -> "Kitchen is Preparing";
            case IN_DELIVERY -> "Out for Delivery";
            case DELIVERED -> "Successfully Delivered";
            case CANCELED -> "Order Canceled";
        };
    }
}