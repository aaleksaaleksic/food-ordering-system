package me.remontada.nwp_backend.config;

import lombok.extern.slf4j.Slf4j;
import me.remontada.nwp_backend.model.ErrorMessage;
import me.remontada.nwp_backend.model.User;
import me.remontada.nwp_backend.repository.ErrorMessageRepository;
import me.remontada.nwp_backend.service.ErrorMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @Autowired
    private ErrorMessageService errorMessageService;


    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException ex) {

        String message = ex.getMessage();

        if (message != null && message.contains("Maximum number of simultaneous orders")) {

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof User) {
                User currentUser = (User) auth.getPrincipal();

                try {
                    ErrorMessage error = ErrorMessage.forImmediateOrderFailure(currentUser, message);
                    errorMessageService.logOrderError(currentUser,error.getErrorMessage(), error.getOperation());
                    log.info("Error message saved to database for user: {}", currentUser.getId());
                } catch (Exception e) {
                    log.error("Failed to save error message to database: {}", e.getMessage());
                }
            }
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "error", "MAX_ORDERS_EXCEEDED",
                            "message", message,
                            "timestamp", LocalDateTime.now(),
                            "type", "ORDER_LIMIT"
                    ));
        }

        if (message != null && message.contains("Cannot schedule order in the past")) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof User) {
                User currentUser = (User) auth.getPrincipal();

                try {
                    ErrorMessage error = new ErrorMessage();
                    error.setOrderId(null);
                    error.setOperation("SCHEDULE_ORDER");
                    error.setErrorMessage(message);
                    error.setUser(currentUser);
                    error.setTimestamp(LocalDateTime.now());
                    errorMessageService.logScheduleError(currentUser,error.getErrorMessage(), error.getOrderId());
                } catch (Exception e) {
                    log.error("Failed to save schedule error message: {}", e.getMessage());
                }
            }
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "error", "INVALID_SCHEDULE_TIME",
                            "message", message,
                            "timestamp", LocalDateTime.now(),
                            "type", "SCHEDULE_ERROR"
                    ));
        }

        if (message != null && message.contains("You can only track your own orders")) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "error", "ACCESS_DENIED",
                            "message", message,
                            "timestamp", LocalDateTime.now()
                    ));
        }

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "error", "INTERNAL_ERROR",
                        "message", message != null ? message : "An unexpected error occurred",
                        "timestamp", LocalDateTime.now()
                ));
    }
}
