package com.spring.dlearning.dto.request;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.spring.dlearning.utils.CourseLevel;
import com.spring.dlearning.utils.Gender;
import lombok.*;
import lombok.experimental.FieldDefaults;

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
    String phone;
    LocalDate dob;
    String address;
    String description;
    CourseLevel courseLevel;
}
