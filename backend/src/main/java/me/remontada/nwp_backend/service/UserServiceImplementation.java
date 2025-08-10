package me.remontada.nwp_backend.service;

import me.remontada.nwp_backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import me.remontada.nwp_backend.repository.UserRepository;

import java.util.List;
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

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public boolean existsByEmail(String email) { return userRepository.existsByEmail(email); }


}
