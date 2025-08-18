package me.remontada.nwp_backend.controller;

import lombok.extern.slf4j.Slf4j;
import me.remontada.nwp_backend.dto.response.CleanupResponse;
import me.remontada.nwp_backend.dto.response.ErrorMessageResponseDTO;
import me.remontada.nwp_backend.mapper.ErrorMessageMapper;
import me.remontada.nwp_backend.model.ErrorMessage;
import me.remontada.nwp_backend.model.User;
import me.remontada.nwp_backend.service.ErrorMessageService;
import me.remontada.nwp_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;


@Slf4j
@RestController
@RequestMapping("/api/v1/errors")
public class ErrorMessageController {

    @Autowired
    private ErrorMessageService errorMessageService;

    @Autowired
    private UserService userService;

    @Autowired
    private ErrorMessageMapper errorMessageMapper;


    @GetMapping
    @PreAuthorize("hasAuthority('CAN_SEARCH_ORDER')")
    public ResponseEntity<Page<ErrorMessageResponseDTO>> getErrorHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {


        User currentUser = getCurrentUser(authentication);

        Pageable pageable = PageRequest.of(page, size);
        Page<ErrorMessage> errors = errorMessageService.getErrorHistory(currentUser, pageable);

        Page<ErrorMessageResponseDTO> errorDTOs = errors.map(errorMessageMapper::toResponseDTO);


        return ResponseEntity.ok(errorDTOs);
    }


    @GetMapping("/all")
    @PreAuthorize("hasAuthority('CAN_READ_USERS')")
    public ResponseEntity<Page<ErrorMessageResponseDTO>> getAllErrors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {


        Pageable pageable = PageRequest.of(page, size);
        Page<ErrorMessage> errors = errorMessageService.getAllErrors(pageable);
        Page<ErrorMessageResponseDTO> errorDTOs = errors.map(errorMessageMapper::toResponseDTO);


        return ResponseEntity.ok(errorDTOs);
    }


    @GetMapping("/operation/{operation}")
    @PreAuthorize("hasAuthority('CAN_READ_USERS')")
    public ResponseEntity<List<ErrorMessageResponseDTO>> getErrorsByOperation(@PathVariable String operation) {

        List<ErrorMessage> errors = errorMessageService.getErrorsByOperation(operation);
        List<ErrorMessageResponseDTO> errorDTOs = errorMessageMapper.toResponseDTOs(errors);
        return ResponseEntity.ok(errorDTOs);
    }


    @GetMapping("/timerange")
    @PreAuthorize("hasAuthority('CAN_READ_USERS')")
    public ResponseEntity<List<ErrorMessage>> getErrorsByTimeRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {


        List<ErrorMessage> errors = errorMessageService.getErrorsByTimeRange(from, to);
        return ResponseEntity.ok(errors);
    }


    @GetMapping("/count/{userId}")
    @PreAuthorize("hasAuthority('CAN_READ_USERS')")
    public ResponseEntity<Long> countErrorsForUser(@PathVariable Long userId) {

        long count = errorMessageService.countErrorsForUser(userId);
        return ResponseEntity.ok(count);
    }


    @DeleteMapping("/cleanup")
    @PreAuthorize("hasAuthority('CAN_DELETE_USERS')")
    public ResponseEntity<CleanupResponse> deleteOldErrors(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime olderThan) {


        int deletedCount = errorMessageService.deleteOldErrors(olderThan);
        CleanupResponse response = new CleanupResponse(deletedCount,
                "Deleted " + deletedCount + " error messages older than " + olderThan);

        return ResponseEntity.ok(response);
    }

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            throw new RuntimeException("User not authenticated");
        }
        return (User) authentication.getPrincipal();
    }

}