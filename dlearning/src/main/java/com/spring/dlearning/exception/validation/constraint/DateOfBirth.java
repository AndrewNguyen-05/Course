package com.spring.dlearning.exception.validation.constraint;

import com.spring.dlearning.exception.validation.validator.DateOfBirthValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = DateOfBirthValidator.class)
public @interface DateOfBirth {
    String message() default "Date of birth must be greater than 1950 and less than current date";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
