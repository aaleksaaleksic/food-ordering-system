package me.remontada.nwp_backend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.Map;


@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException ex) {

        String message = ex.getMessage();

        if (message != null && message.contains("Maximum number of simultaneous orders")) {
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
