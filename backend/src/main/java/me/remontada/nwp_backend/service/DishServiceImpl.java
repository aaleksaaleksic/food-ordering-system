package me.remontada.nwp_backend.service;

import lombok.extern.slf4j.Slf4j;
import me.remontada.nwp_backend.model.Dish;
import me.remontada.nwp_backend.repository.DishRepository;
import me.remontada.nwp_backend.service.DishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Slf4j
@Service
@Transactional
public class DishServiceImpl implements DishService {

    @Autowired
    private DishRepository dishRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Dish> getAllAvailableDishes() {
        return dishRepository.findByAvailableTrueOrderByCategory();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Dish> getAllDishes() {
        return dishRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Dish getDishById(Long id) {

        Optional<Dish> dishOpt = dishRepository.findById(id);
        if (dishOpt.isEmpty()) {
            throw new RuntimeException("Dish not found with id: " + id);
        }

        return dishOpt.get();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Dish> getDishesByCategory(String category, boolean onlyAvailable) {

        if (onlyAvailable) {
            return dishRepository.findByCategoryAndAvailableTrueOrderByName(category);
        } else {
            return dishRepository.findByCategoryOrderByName(category);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Dish> searchDishesByName(String name) {

        if (name == null || name.trim().isEmpty()) {
            return getAllAvailableDishes();
        }

        return dishRepository.findByNameContainingIgnoreCaseAndAvailableTrue(name.trim());
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getAllCategories() {
        return dishRepository.findDistinctCategories();
    }

    @Override
    public Dish createDish(Dish dish) {

        validateDish(dish);

        if (dish.getAvailable() == null) {
            dish.setAvailable(true);
        }

        Dish savedDish = dishRepository.save(dish);

        return savedDish;
    }

    @Override
    public Dish updateDish(Long id, Dish dishData) {

        Dish existingDish = getDishById(id);

        validateDish(dishData);

        existingDish.setName(dishData.getName());
        existingDish.setDescription(dishData.getDescription());
        existingDish.setPrice(dishData.getPrice());
        existingDish.setCategory(dishData.getCategory());

        if (dishData.getAvailable() != null) {
            existingDish.setAvailable(dishData.getAvailable());
        }

        Dish savedDish = dishRepository.save(existingDish);

        return savedDish;
    }

    @Override
    public void deleteDish(Long id) {

        Dish dish = getDishById(id);

        dishRepository.delete(dish);
    }

    @Override
    public Dish updateDishAvailability(Long id, boolean available) {

        Dish dish = getDishById(id);
        dish.setAvailable(available);

        Dish savedDish = dishRepository.save(dish);

        return savedDish;
    }


    private void validateDish(Dish dish) {
        if (dish.getName() == null || dish.getName().trim().isEmpty()) {
            throw new RuntimeException("Dish name is required");
        }

        if (dish.getPrice() == null || dish.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Dish price must be greater than 0");
        }

        if (dish.getCategory() == null || dish.getCategory().trim().isEmpty()) {
            throw new RuntimeException("Dish category is required");
        }

        if (dish.getName().length() > 100) {
            throw new RuntimeException("Dish name cannot be longer than 100 characters");
        }

        if (dish.getDescription() != null && dish.getDescription().length() > 500) {
            throw new RuntimeException("Dish description cannot be longer than 500 characters");
        }
    }
}