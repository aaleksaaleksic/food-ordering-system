package me.remontada.nwp_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponseDTO {
    private Long id;
    private DishSimpleDTO dish;
    private Integer quantity;
    private BigDecimal priceAtTime;
    private BigDecimal totalPrice;  //  priceAtTime * quantity
}