package me.remontada.nwp_backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

/**
 * JOIN TABLE  Order & Dish
 */
@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dish_id", nullable = false)
    private Dish dish;


    @Column(nullable = false, name = "quantity")
    private Integer quantity = 1;


    @Column(name = "price_at_time", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceAtTime;


    public BigDecimal getTotalPrice() {
        return priceAtTime.multiply(BigDecimal.valueOf(quantity));
    }


    public OrderItem(Order order, Dish dish, Integer quantity) {
        this.order = order;
        this.dish = dish;
        this.quantity = quantity;
        this.priceAtTime = dish.getPrice();
    }
}