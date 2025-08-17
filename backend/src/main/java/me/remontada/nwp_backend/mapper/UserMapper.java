package me.remontada.nwp_backend.mapper;

import me.remontada.nwp_backend.dto.response.UserSimpleDTO;
import me.remontada.nwp_backend.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserSimpleDTO toSimpleDTO(User user) {
        if (user == null) {
            return null;
        }

        UserSimpleDTO dto = new UserSimpleDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());

        //full name
        dto.setFullName(user.getFirstName() + " " + user.getLastName());

        return dto;
    }
}