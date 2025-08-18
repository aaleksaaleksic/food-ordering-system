package me.remontada.nwp_backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.ORDERED;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;


    @Column(nullable = false)
    private Boolean active = true;


    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;


    @Column(name = "scheduled_for")
    private LocalDateTime scheduledFor;


    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> items;


    public boolean canBeCanceled() {
        return status == OrderStatus.ORDERED;
    }


    public boolean countsInSimultaneousLimit() {
        return status == OrderStatus.PREPARING || status == OrderStatus.IN_DELIVERY;
    }


    public boolean isFinished() {
        return status == OrderStatus.DELIVERED || status == OrderStatus.CANCELED;
    }


    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}