package me.remontada.nwp_backend.controller;

import lombok.extern.slf4j.Slf4j;
import me.remontada.nwp_backend.dto.DishAvailabilityUpdateRequest;
import me.remontada.nwp_backend.dto.DishCreateRequest;
import me.remontada.nwp_backend.dto.DishUpdateRequest;
import me.remontada.nwp_backend.model.Dish;
import me.remontada.nwp_backend.service.DishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;


@Slf4j
@RestController
@RequestMapping("/api/v1/dishes")
public class DishController {

    @Autowired
    private DishService dishService;


    @GetMapping
    public ResponseEntity<List<Dish>> getAllAvailableDishes() {

        List<Dish> dishes = dishService.getAllAvailableDishes();
        return ResponseEntity.ok(dishes);
    }


    @GetMapping("/all")
    @PreAuthorize("hasAuthority('CAN_READ_USERS')")
    public ResponseEntity<List<Dish>> getAllDishes() {

        List<Dish> dishes = dishService.getAllDishes();
        return ResponseEntity.ok(dishes);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Dish> getDishById(@PathVariable Long id) {
        log.info("Get dish by id request: {}", id);

        Dish dish = dishService.getDishById(id);
        return ResponseEntity.ok(dish);
    }


    @GetMapping("/category/{category}")
    public ResponseEntity<List<Dish>> getDishesByCategory(
            @PathVariable String category,
            @RequestParam(required = false, defaultValue = "true") boolean onlyAvailable) {


        List<Dish> dishes = dishService.getDishesByCategory(category, onlyAvailable);
        return ResponseEntity.ok(dishes);
    }


    @GetMapping("/search")
    public ResponseEntity<List<Dish>> searchDishesByName(@RequestParam String name) {

        List<Dish> dishes = dishService.searchDishesByName(name);
        return ResponseEntity.ok(dishes);
    }


    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {

        List<String> categories = dishService.getAllCategories();
        return ResponseEntity.ok(categories);
    }


    @PostMapping
    @PreAuthorize("hasAuthority('CAN_CREATE_USERS')")
    public ResponseEntity<Dish> createDish(@Valid @RequestBody DishCreateRequest request) {

        Dish dish = new Dish();
        dish.setName(request.getName());
        dish.setDescription(request.getDescription());
        dish.setPrice(request.getPrice());
        dish.setCategory(request.getCategory());
        dish.setAvailable(request.getAvailable() != null ? request.getAvailable() : true);

        Dish createdDish = dishService.createDish(dish);
        return ResponseEntity.ok(createdDish);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('CAN_UPDATE_USERS')")
    public ResponseEntity<Dish> updateDish(
            @PathVariable Long id,
            @Valid @RequestBody DishUpdateRequest request) {


        Dish dishData = new Dish();
        dishData.setName(request.getName());
        dishData.setDescription(request.getDescription());
        dishData.setPrice(request.getPrice());
        dishData.setCategory(request.getCategory());
        dishData.setAvailable(request.getAvailable());

        Dish updatedDish = dishService.updateDish(id, dishData);
        return ResponseEntity.ok(updatedDish);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('CAN_DELETE_USERS')") // Admin permission
    public ResponseEntity<Void> deleteDish(@PathVariable Long id) {

        dishService.deleteDish(id);
        return ResponseEntity.ok().build();
    }


    @PutMapping("/{id}/availability")
    @PreAuthorize("hasAuthority('CAN_UPDATE_USERS')") // Admin permission
    public ResponseEntity<Dish> updateDishAvailability(
            @PathVariable Long id,
            @RequestBody DishAvailabilityUpdateRequest request) {


        Dish updatedDish = dishService.updateDishAvailability(id, request.getAvailable());
        return ResponseEntity.ok(updatedDish);
    }



}