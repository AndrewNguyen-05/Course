package com.spring.dlearning.repository;

import com.spring.dlearning.entity.PaymentMethod;
import com.spring.dlearning.common.PaymentMethodName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
    Optional<PaymentMethod> findByMethodName(PaymentMethodName methodName);
}
