package me.remontada.nwp_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSimpleDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String fullName;  // firstName + lastName
}