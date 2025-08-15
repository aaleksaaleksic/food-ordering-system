package me.remontada.nwp_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "order_status_transitions")
public class OrderStatusTransition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_status", nullable = false)
    private OrderStatus targetStatus;

    @Column(name = "scheduled_for", nullable = false)
    private LocalDateTime scheduledFor;

    @Column(name = "processed", nullable = false)
    private Boolean processed = false;

    public OrderStatusTransition(Long orderId, OrderStatus targetStatus, LocalDateTime scheduledFor) {
        this.orderId = orderId;
        this.targetStatus = targetStatus;
        this.scheduledFor = scheduledFor;
        this.processed = false;
    }
}