package me.remontada.nwp_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import me.remontada.nwp_backend.model.Permission;

import java.util.Set;

@Data
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Set<Permission> permissions;

}
