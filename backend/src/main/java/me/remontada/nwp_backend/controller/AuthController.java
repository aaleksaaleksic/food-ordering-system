package me.remontada.nwp_backend.controller;

import jakarta.validation.Valid;
import me.remontada.nwp_backend.dto.response.AuthResponse;
import me.remontada.nwp_backend.dto.LoginRequest;
import me.remontada.nwp_backend.model.User;
import me.remontada.nwp_backend.service.UserService;
import me.remontada.nwp_backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserService userService;
    private JwtUtil jwtUtil;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(UserService userService, JwtUtil jwtUtil, PasswordEncoder passwordEncoder){
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest){

        Optional<User> userOptional = userService.findByEmail(loginRequest.getEmail());

        if(userOptional.isEmpty()){

            return ResponseEntity.status(401).body("Invalid credentials!");
        }
        User user = userOptional.get();

        if(!passwordEncoder.matches(loginRequest.getPassword(),user.getPassword())){

            return ResponseEntity.status(401).body("Invalid credentials!");
        }

        String token = jwtUtil.generateToken(loginRequest.getEmail());




        return ResponseEntity.ok(new AuthResponse(token));



    }


    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        if (auth == null || !(auth.getPrincipal() instanceof User)) {
            return ResponseEntity.status(401).body(Map.of("message","Unauthorized"));
        }

        User user = (User) auth.getPrincipal();

        Map<String, Object> body = Map.of(
                "email", user.getEmail(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "permissions", user.getPermissions()
        );
        return ResponseEntity.ok(body);
    }



}
