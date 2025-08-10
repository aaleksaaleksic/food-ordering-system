package me.remontada.nwp_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import me.remontada.nwp_backend.model.Permission;

import java.util.Set;

@Data
public class UserRequest {

    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotBlank @Email
    private String email;

    //TODO za create je password obavezan a za PUT i DELETE moramo u kontroleru
    private String password;

    private Set<Permission> permissions;

}
