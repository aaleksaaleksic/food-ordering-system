package me.remontada.nwp_backend.repository;

import me.remontada.nwp_backend.model.Dish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface DishRepository extends JpaRepository<Dish, Long> {


    List<Dish> findByAvailableTrueOrderByCategory();


    List<Dish> findByCategoryOrderByName(String category);


    List<Dish> findByCategoryAndAvailableTrueOrderByName(String category);


    @Query("SELECT d FROM Dish d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :name, '%')) " +
            "AND d.available = true ORDER BY d.name")
    List<Dish> findByNameContainingIgnoreCaseAndAvailableTrue(@Param("name") String name);


    @Query("SELECT DISTINCT d.category FROM Dish d WHERE d.available = true ORDER BY d.category")
    List<String> findDistinctCategories();
}