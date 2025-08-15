package me.remontada.nwp_backend.repository;

import me.remontada.nwp_backend.model.ErrorMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface ErrorMessageRepository extends JpaRepository<ErrorMessage, Long> {


    Page<ErrorMessage> findByUserIdOrderByTimestampDesc(Long userId, Pageable pageable);


    Page<ErrorMessage> findAllByOrderByTimestampDesc(Pageable pageable);


    @Query("SELECT e FROM ErrorMessage e WHERE e.timestamp BETWEEN :from AND :to " +
            "ORDER BY e.timestamp DESC")
    List<ErrorMessage> findByTimestampBetween(@Param("from") LocalDateTime from,
                                              @Param("to") LocalDateTime to);


    List<ErrorMessage> findByOperationOrderByTimestampDesc(String operation);


    long countByUserId(Long userId);
}