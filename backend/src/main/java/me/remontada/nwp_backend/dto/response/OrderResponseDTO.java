package me.remontada.nwp_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.remontada.nwp_backend.model.OrderStatus;
import java.time.LocalDateTime;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDTO {
    private Long id;
    private OrderStatus status;
    private UserSimpleDTO createdBy;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime scheduledFor;
    private List<OrderItemResponseDTO> items;
    private Integer totalItems;
    private String statusDisplayName;
}