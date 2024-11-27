package com.spring.dlearning.dto.response;

import com.spring.dlearning.common.RegistrationStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRegisterTeacherResponse {

    String email;
    String name;
    String phone;

    String expertise;
    Double yearsOfExperience;
    String bio;
    String facebookLink;
    String certificate;
    String cvUrl;

    RegistrationStatus registrationStatus;

}
