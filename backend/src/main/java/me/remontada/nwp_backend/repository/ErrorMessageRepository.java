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


    @Query("SELECT e FROM ErrorMessage e JOIN FETCH e.user WHERE e.user.id = :userId ORDER BY e.timestamp DESC")
    Page<ErrorMessage> findByUserIdOrderByTimestampDesc(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT e FROM ErrorMessage e JOIN FETCH e.user ORDER BY e.timestamp DESC")
    Page<ErrorMessage> findAllByOrderByTimestampDesc(Pageable pageable);

    @Query("SELECT e FROM ErrorMessage e JOIN FETCH e.user WHERE e.timestamp BETWEEN :from AND :to ORDER BY e.timestamp DESC")
    List<ErrorMessage> findByTimestampBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("SELECT e FROM ErrorMessage e JOIN FETCH e.user WHERE e.operation = :operation ORDER BY e.timestamp DESC")
    List<ErrorMessage> findByOperationOrderByTimestampDesc(@Param("operation") String operation);


    long countByUserId(Long userId);
}