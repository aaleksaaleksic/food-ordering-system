package me.remontada.nwp_backend.controller;

import me.remontada.nwp_backend.dto.AuthResponse;
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
@RequestMapping("/api/auth")
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
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){

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
        if (auth == null || !(auth.getPrincipal() instanceof User u)) {
            return ResponseEntity.status(401).body(Map.of("message","Unauthorized"));
        }
        Map<String, Object> body = Map.of(
                "email", u.getEmail(),
                "firstName", u.getFirstName(),
                "lastName", u.getLastName(),
                "permissions", u.getPermissions()
        );
        return ResponseEntity.ok(body);
    }



}
