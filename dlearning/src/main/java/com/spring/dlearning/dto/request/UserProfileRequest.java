package com.spring.dlearning.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.spring.dlearning.common.CourseLevel;
import com.spring.dlearning.common.Gender;
import com.spring.dlearning.exception.validation.constraint.DateOfBirth;
import com.spring.dlearning.exception.validation.constraint.PhoneNumber;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserProfileRequest {

    String avatar;
    String firstName;
    String lastName;
    Gender gender;
    @PhoneNumber(message = "PHONE_NUMBER_INVALID")
    String phone;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @DateOfBirth(message = "INVALID_DOB")
    LocalDate dob;
    String address;

    @Size(max = 400)
    String description;
    CourseLevel courseLevel;
}
