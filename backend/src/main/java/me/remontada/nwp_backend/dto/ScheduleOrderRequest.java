package me.remontada.nwp_backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.Valid;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleOrderRequest {


    @Valid
    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItemRequest> items;

    @NotNull(message = "Scheduled time is required")
    @Future(message = "Scheduled time must be in the future")
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime scheduledFor;

}