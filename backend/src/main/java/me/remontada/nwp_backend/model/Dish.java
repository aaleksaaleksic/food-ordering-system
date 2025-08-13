package me.remontada.nwp_backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;


@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "dishes")
public class Dish {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String name;


    @Column(length = 500)
    private String description;


    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;


    @Column(nullable = false)
    private String category;


    @Column(nullable = false)
    private Boolean available = true;


    public boolean isAvailable() {
        return available != null && available;
    }
}