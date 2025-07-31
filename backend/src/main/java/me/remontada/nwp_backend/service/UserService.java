package me.remontada.nwp_backend.service;

import me.remontada.nwp_backend.model.User;

import java.util.Optional;

public interface UserService {

    Optional<User> findByEmail(String email);

}
