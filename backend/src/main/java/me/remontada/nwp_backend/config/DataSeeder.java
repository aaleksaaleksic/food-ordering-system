package me.remontada.nwp_backend.config;

import me.remontada.nwp_backend.model.*;
import me.remontada.nwp_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;


@Component
public class DataSeeder implements ApplicationRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DishRepository dishRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) throws Exception {

        if (userRepository.count() > 0) {
            return;
        }


        seedUsers();
        seedDishes();
        seedOrders();

        System.out.println(" Database seeding completed successfully!");
    }

    private void seedUsers() {

        //  SUPER ADMIN
        User admin = new User();
        admin.setFirstName("Admin");
        admin.setLastName("Supreme");
        admin.setEmail("admin@foodorder.com");
        admin.setPassword(passwordEncoder.encode("password123"));
        admin.setPermissions(Set.of(
                Permission.CAN_CREATE_USERS,
                Permission.CAN_READ_USERS,
                Permission.CAN_UPDATE_USERS,
                Permission.CAN_DELETE_USERS,
                Permission.CAN_SEARCH_ORDER,
                Permission.CAN_PLACE_ORDER,
                Permission.CAN_CANCEL_ORDER,
                Permission.CAN_TRACK_ORDER,
                Permission.CAN_SCHEDULE_ORDER
        ));
        userRepository.save(admin);

        //CUSTOMER
        User customer = new User();
        customer.setFirstName("John");
        customer.setLastName("Doe");
        customer.setEmail("customer@test.com");
        customer.setPassword(passwordEncoder.encode("customer123"));
        customer.setPermissions(Set.of(
                Permission.CAN_SEARCH_ORDER,
                Permission.CAN_PLACE_ORDER,
                Permission.CAN_CANCEL_ORDER,
                Permission.CAN_TRACK_ORDER,
                Permission.CAN_SCHEDULE_ORDER
        ));
        userRepository.save(customer);

        //  MANAGER
        User manager = new User();
        manager.setFirstName("Jane");
        manager.setLastName("Manager");
        manager.setEmail("manager@test.com");
        manager.setPassword(passwordEncoder.encode("manager123"));
        manager.setPermissions(Set.of(
                Permission.CAN_READ_USERS,
                Permission.CAN_UPDATE_USERS,
                Permission.CAN_SEARCH_ORDER,
                Permission.CAN_PLACE_ORDER,
                Permission.CAN_CANCEL_ORDER,
                Permission.CAN_TRACK_ORDER
        ));
        userRepository.save(manager);

        //  LIMITED USER
        User limitedUser = new User();
        limitedUser.setFirstName("Bob");
        limitedUser.setLastName("Limited");
        limitedUser.setEmail("limited@test.com");
        limitedUser.setPassword(passwordEncoder.encode("limited123"));
        limitedUser.setPermissions(Set.of(
                Permission.CAN_SEARCH_ORDER,
                Permission.CAN_TRACK_ORDER
        ));
        userRepository.save(limitedUser);

        // NO PERMISSIONS USER
        User noPermUser = new User();
        noPermUser.setFirstName("Empty");
        noPermUser.setLastName("User");
        noPermUser.setEmail("noperm@test.com");
        noPermUser.setPassword(passwordEncoder.encode("noperm123"));
        noPermUser.setPermissions(Set.of());
        userRepository.save(noPermUser);
    }

    private void seedDishes() {

        // PIZZA
        dishRepository.save(createDish("Margherita Pizza", "Classic pizza with fresh tomato sauce, mozzarella, and basil",
                new BigDecimal("1200.00"), "Pizza", true));
        dishRepository.save(createDish("Pepperoni Pizza", "Spicy pepperoni with mozzarella and tomato sauce",
                new BigDecimal("1400.00"), "Pizza", true));
        dishRepository.save(createDish("Quattro Stagioni", "Four seasons pizza with mushrooms, artichokes, ham, and olives",
                new BigDecimal("1600.00"), "Pizza", true));
        dishRepository.save(createDish("Hawaiian Pizza", "Ham and pineapple with mozzarella (controversial but delicious)",
                new BigDecimal("1350.00"), "Pizza", false));

        // BURGERS
        dishRepository.save(createDish("Classic Cheeseburger", "Beef patty with cheddar cheese, lettuce, tomato, and onion",
                new BigDecimal("1000.00"), "Burgers", true));
        dishRepository.save(createDish("Chicken Deluxe", "Grilled chicken breast with avocado and bacon",
                new BigDecimal("1150.00"), "Burgers", true));
        dishRepository.save(createDish("Veggie Burger", "Plant-based patty with fresh vegetables",
                new BigDecimal("950.00"), "Burgers", true));

        // SALADS
        dishRepository.save(createDish("Caesar Salad", "Crisp romaine lettuce with caesar dressing and croutons",
                new BigDecimal("800.00"), "Salads", true));
        dishRepository.save(createDish("Greek Salad", "Fresh vegetables with feta cheese and olive oil",
                new BigDecimal("750.00"), "Salads", true));
        dishRepository.save(createDish("Quinoa Power Bowl", "Superfood salad with quinoa, avocado, and nuts",
                new BigDecimal("900.00"), "Salads", true));

        // PASTA
        dishRepository.save(createDish("Spaghetti Carbonara", "Traditional Italian pasta with eggs, cheese, and pancetta",
                new BigDecimal("1100.00"), "Pasta", true));
        dishRepository.save(createDish("Penne Arrabbiata", "Spicy tomato sauce with garlic and red pepper",
                new BigDecimal("950.00"), "Pasta", true));
        dishRepository.save(createDish("Fettuccine Alfredo", "Creamy white sauce with parmesan cheese",
                new BigDecimal("1050.00"), "Pasta", false));

        // DESSERTS
        dishRepository.save(createDish("Tiramisu", "Classic Italian dessert with coffee and mascarpone",
                new BigDecimal("600.00"), "Desserts", true));
        dishRepository.save(createDish("Chocolate Lava Cake", "Warm chocolate cake with molten center",
                new BigDecimal("650.00"), "Desserts", true));
        dishRepository.save(createDish("Panna Cotta", "Silky vanilla dessert with berry sauce",
                new BigDecimal("550.00"), "Desserts", true));

        // BEVERAGES
        dishRepository.save(createDish("Fresh Orange Juice", "Freshly squeezed orange juice",
                new BigDecimal("300.00"), "Beverages", true));
        dishRepository.save(createDish("Craft Cola", "Artisanal cola with natural ingredients",
                new BigDecimal("250.00"), "Beverages", true));
        dishRepository.save(createDish("Iced Coffee", "Cold brew coffee with ice",
                new BigDecimal("350.00"), "Beverages", true));

    }

    private Dish createDish(String name, String description, BigDecimal price, String category, boolean available) {
        Dish dish = new Dish();
        dish.setName(name);
        dish.setDescription(description);
        dish.setPrice(price);
        dish.setCategory(category);
        dish.setAvailable(available);
        return dish;
    }

    private void seedOrders() {

        User customer = userRepository.findByEmail("customer@test.com").orElse(null);
        User admin = userRepository.findByEmail("admin@foodorder.com").orElse(null);

        if (customer == null || admin == null) {
            return;
        }


        var dishes = dishRepository.findAll();
        if (dishes.size() < 3) {
            return;
        }


        Order order1 = new Order();
        order1.setCreatedBy(customer);
        order1.setStatus(OrderStatus.DELIVERED);
        order1.setActive(true);
        order1.setCreatedAt(LocalDateTime.now().minusHours(2));
        order1 = orderRepository.save(order1);


        createOrderItem(order1, dishes.get(0), 2); // 2x prva jela
        createOrderItem(order1, dishes.get(1), 1); // 1x drugo jelo


        Order order2 = new Order();
        order2.setCreatedBy(admin);
        order2.setStatus(OrderStatus.IN_DELIVERY);
        order2.setActive(true);
        order2.setCreatedAt(LocalDateTime.now().minusMinutes(30));
        order2 = orderRepository.save(order2);

        createOrderItem(order2, dishes.get(2), 1);
        createOrderItem(order2, dishes.get(3), 1);
        createOrderItem(order2, dishes.get(4), 3);


        Order order3 = new Order();
        order3.setCreatedBy(customer);
        order3.setStatus(OrderStatus.ORDERED);
        order3.setActive(true);
        order3.setCreatedAt(LocalDateTime.now().minusMinutes(5));
        order3 = orderRepository.save(order3);

        createOrderItem(order3, dishes.get(0), 1);
        createOrderItem(order3, dishes.get(5), 2);


        Order order4 = new Order();
        order4.setCreatedBy(customer);
        order4.setStatus(OrderStatus.ORDERED);
        order4.setActive(true);
        order4.setCreatedAt(LocalDateTime.now());
        order4.setScheduledFor(LocalDateTime.now().plusHours(2)); // Za 2 sata
        order4 = orderRepository.save(order4);

        createOrderItem(order4, dishes.get(6), 1);

        Order order5 = new Order();
        order5.setCreatedBy(customer);
        order5.setStatus(OrderStatus.CANCELED);
        order5.setActive(false);
        order5.setCreatedAt(LocalDateTime.now().minusHours(1));
        order5 = orderRepository.save(order5);

        createOrderItem(order5, dishes.get(7), 2);
    }

    private void createOrderItem(Order order, Dish dish, int quantity) {
        OrderItem item = new OrderItem();
        item.setOrder(order);
        item.setDish(dish);
        item.setQuantity(quantity);
        item.setPriceAtTime(dish.getPrice());
    }
}