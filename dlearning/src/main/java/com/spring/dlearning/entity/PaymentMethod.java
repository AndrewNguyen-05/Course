package com.spring.dlearning.entity;

import com.spring.dlearning.common.PaymentMethodName;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class PaymentMethod extends AbstractEntity<Long> {

    @Column(name = "method_name", nullable = false)
    @Enumerated(EnumType.STRING)
    PaymentMethodName methodName;

    @Column(name = "details")
    String details;
}
