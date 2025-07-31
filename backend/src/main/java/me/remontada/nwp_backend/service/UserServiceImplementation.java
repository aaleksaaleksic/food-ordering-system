package me.remontada.nwp_backend.service;

import me.remontada.nwp_backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import me.remontada.nwp_backend.repository.UserRepository;

import java.util.Optional;

@Service
public class UserServiceImplementation implements UserService {


   private final UserRepository userRepository;


    @Autowired
    public UserServiceImplementation(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
