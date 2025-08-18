package me.remontada.nwp_backend.mapper;

import me.remontada.nwp_backend.dto.response.ErrorMessageResponseDTO;
import me.remontada.nwp_backend.dto.response.UserSimpleDTO;
import me.remontada.nwp_backend.model.ErrorMessage;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ErrorMessageMapper {

    public ErrorMessageResponseDTO toResponseDTO(ErrorMessage errorMessage) {
        if (errorMessage == null) {
            return null;
        }

        ErrorMessageResponseDTO dto = new ErrorMessageResponseDTO();
        dto.setId(errorMessage.getId());
        dto.setOrderId(errorMessage.getOrderId());
        dto.setOperation(errorMessage.getOperation());
        dto.setErrorMessage(errorMessage.getErrorMessage());
        dto.setTimestamp(errorMessage.getTimestamp());

        if (errorMessage.getUser() != null) {
            UserSimpleDTO userDTO = new UserSimpleDTO();
            userDTO.setId(errorMessage.getUser().getId());
            userDTO.setFirstName(errorMessage.getUser().getFirstName());
            userDTO.setLastName(errorMessage.getUser().getLastName());
            userDTO.setEmail(errorMessage.getUser().getEmail());
            userDTO.setFullName(errorMessage.getUser().getFirstName() + " " + errorMessage.getUser().getLastName());
            dto.setUser(userDTO);
        }

        return dto;
    }

    public List<ErrorMessageResponseDTO> toResponseDTOs(List<ErrorMessage> errorMessages) {
        if (errorMessages == null) {
            return null;
        }

        return errorMessages.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }
}