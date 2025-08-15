package me.remontada.nwp_backend.service;

import me.remontada.nwp_backend.model.ErrorMessage;
import me.remontada.nwp_backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;


public interface ErrorMessageService {


    Page<ErrorMessage> getErrorHistory(User user, Pageable pageable);


    Page<ErrorMessage> getAllErrors(Pageable pageable);


    List<ErrorMessage> getErrorsByOperation(String operation);


    List<ErrorMessage> getErrorsByTimeRange(LocalDateTime from, LocalDateTime to);


    int deleteOldErrors(LocalDateTime olderThan);


    long countErrorsForUser(Long userId);
}