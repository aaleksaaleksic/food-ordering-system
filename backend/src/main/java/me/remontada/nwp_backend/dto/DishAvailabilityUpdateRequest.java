package me.remontada.nwp_backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class DishAvailabilityUpdateRequest {

    @NotNull(message = "Available flag is required")
    private Boolean available;
}