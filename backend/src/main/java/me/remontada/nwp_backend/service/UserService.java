package me.remontada.nwp_backend.service;

import me.remontada.nwp_backend.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    Optional<User> findByEmail(String email);

    List<User> findAll();

    boolean existsByEmail(String email);

    User save (User user);


    Optional<User> findById(Long id);

    void deleteById(Long id);
}
