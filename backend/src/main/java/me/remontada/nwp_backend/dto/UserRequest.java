package me.remontada.nwp_backend.dto;

import lombok.Data;
import me.remontada.nwp_backend.model.Permission;

import java.util.Set;

@Data
public class UserRequest {

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private Set<Permission> permissions;

}
