package com.spring.dlearning.repository;

import com.spring.dlearning.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query("SELECT p FROM Payment p WHERE p.user.id = :id ORDER BY p.createdAt DESC ")
    Page<Payment> transactionHistory(Long id, Pageable pageable);

    Optional<Payment> findByTransactionId(String transactionId);

}
