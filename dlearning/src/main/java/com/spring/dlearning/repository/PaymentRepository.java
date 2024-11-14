package com.spring.dlearning.repository;

import com.spring.dlearning.entity.Payment;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.utils.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query("SELECT p FROM Payment p WHERE p.user = :user AND p.createdAt BETWEEN :start AND :end ORDER BY p.createdAt DESC")
    List<Payment> findByUserAndDateRange(@Param("user") User user, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT p FROM Payment p WHERE p.course.author = :author AND p.status = :status AND p.createdAt BETWEEN :startDate AND :endDate")
    List<Payment> findPaymentsByAuthorStatusAndDateRange(@Param("author") User author, @Param("status") PaymentStatus status,
                                                         @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

}
