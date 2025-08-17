package me.remontada.nwp_backend.mapper;

import me.remontada.nwp_backend.dto.response.OrderItemResponseDTO;
import me.remontada.nwp_backend.dto.response.DishSimpleDTO;
import me.remontada.nwp_backend.model.OrderItem;
import org.springframework.stereotype.Component;

@Component
public class OrderItemMapper {

    public OrderItemResponseDTO toResponseDTO(OrderItem orderItem) {
        if (orderItem == null) {
            return null;
        }

        OrderItemResponseDTO dto = new OrderItemResponseDTO();
        dto.setId(orderItem.getId());
        dto.setQuantity(orderItem.getQuantity());
        dto.setPriceAtTime(orderItem.getPriceAtTime());


        dto.setTotalPrice(orderItem.getTotalPrice());


        if (orderItem.getDish() != null) {
            DishSimpleDTO dishDTO = new DishSimpleDTO();
            dishDTO.setId(orderItem.getDish().getId());
            dishDTO.setName(orderItem.getDish().getName());
            dishDTO.setDescription(orderItem.getDish().getDescription());
            dishDTO.setPrice(orderItem.getDish().getPrice());
            dishDTO.setCategory(orderItem.getDish().getCategory());
            dto.setDish(dishDTO);
        }

        return dto;
    }
}