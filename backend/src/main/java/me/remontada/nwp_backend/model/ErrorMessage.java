package me.remontada.nwp_backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;


@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "error_messages")
public class ErrorMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "order_id")
    private Long orderId;

    /**
     "PLACE_ORDER", "SCHEDULE_ORDER", "AUTO_CREATE_SCHEDULED"
     */
    @Column(nullable = false)
    private String operation;

    /**
     "Maximum number of simultaneous orders (3) exceeded"
     */
    @Column(nullable = false, length = 1000)
    private String errorMessage;


    @Column(nullable = false)
    private LocalDateTime timestamp;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Lifecycle callback
     */
    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }


    public static ErrorMessage forScheduledOrderFailure(Long orderId, User user, String errorMessage) {
        ErrorMessage error = new ErrorMessage();
        error.setOrderId(orderId);
        error.setOperation("AUTO_CREATE_SCHEDULED");
        error.setErrorMessage(errorMessage);
        error.setUser(user);
        error.setTimestamp(LocalDateTime.now());
        return error;
    }


    public static ErrorMessage forImmediateOrderFailure(User user, String errorMessage) {
        ErrorMessage error = new ErrorMessage();
        error.setOrderId(null);
        error.setOperation("PLACE_ORDER");
        error.setErrorMessage(errorMessage);
        error.setUser(user);
        error.setTimestamp(LocalDateTime.now());
        return error;
    }
}