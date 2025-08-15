package me.remontada.nwp_backend.service;

import me.remontada.nwp_backend.model.Dish;

import java.util.List;


public interface DishService {


    List<Dish> getAllAvailableDishes();


    List<Dish> getAllDishes();


    Dish getDishById(Long id);


    List<Dish> getDishesByCategory(String category, boolean onlyAvailable);


    List<Dish> searchDishesByName(String name);


    List<String> getAllCategories();


    Dish createDish(Dish dish);


    Dish updateDish(Long id, Dish dish);


    void deleteDish(Long id);

    Dish updateDishAvailability(Long id, boolean available);
}