package me.remontada.nwp_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorMessageResponseDTO {
    private Long id;
    private Long orderId;
    private String operation;
    private String errorMessage;
    private LocalDateTime timestamp;
    private UserSimpleDTO user;
}