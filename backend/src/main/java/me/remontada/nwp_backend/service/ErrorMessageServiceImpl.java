package me.remontada.nwp_backend.service;

import lombok.extern.slf4j.Slf4j;
import me.remontada.nwp_backend.model.ErrorMessage;
import me.remontada.nwp_backend.model.User;
import me.remontada.nwp_backend.repository.ErrorMessageRepository;
import me.remontada.nwp_backend.service.ErrorMessageService;
import me.remontada.nwp_backend.util.PermissionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;


@Slf4j
@Service
@Transactional
public class ErrorMessageServiceImpl implements ErrorMessageService {

    @Autowired
    private ErrorMessageRepository errorMessageRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<ErrorMessage> getErrorHistory(User user, Pageable pageable) {

        boolean isAdmin = PermissionUtils.isAdmin(user);

        if (isAdmin) {
            return errorMessageRepository.findAllByOrderByTimestampDesc(pageable);
        } else {
            return errorMessageRepository.findByUserIdOrderByTimestampDesc(user.getId(), pageable);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ErrorMessage> getAllErrors(Pageable pageable) {
        return errorMessageRepository.findAllByOrderByTimestampDesc(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ErrorMessage> getErrorsByOperation(String operation) {

        if (operation == null || operation.trim().isEmpty()) {
            throw new RuntimeException("Operation parameter is required");
        }

        return errorMessageRepository.findByOperationOrderByTimestampDesc(operation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ErrorMessage> getErrorsByTimeRange(LocalDateTime from, LocalDateTime to) {

        if (from == null || to == null) {
            throw new RuntimeException("Both from and to parameters are required");
        }

        if (from.isAfter(to)) {
            throw new RuntimeException("From date cannot be after to date");
        }

        return errorMessageRepository.findByTimestampBetween(from, to);
    }

    @Override
    public int deleteOldErrors(LocalDateTime olderThan) {

        if (olderThan == null) {
            throw new RuntimeException("OlderThan parameter is required");
        }

        List<ErrorMessage> oldErrors = errorMessageRepository.findByTimestampBetween(
                LocalDateTime.of(2000, 1, 1, 0, 0), olderThan);

        int count = oldErrors.size();

        if (count > 0) {
            errorMessageRepository.deleteAll(oldErrors);
        }

        return count;
    }

    @Override
    @Transactional(readOnly = true)
    public long countErrorsForUser(Long userId) {

        if (userId == null) {
            throw new RuntimeException("User ID is required");
        }

        return errorMessageRepository.countByUserId(userId);
    }
}