package me.remontada.nwp_backend.dto.response;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CleanupResponse {
    private int deletedCount;
    private String message;
}