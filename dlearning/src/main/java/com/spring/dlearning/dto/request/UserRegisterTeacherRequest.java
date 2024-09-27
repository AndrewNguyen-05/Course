package com.spring.dlearning.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRegisterTeacherRequest {

    String email;
    String name;
    String phone;
    String expertise;
    Double yearsOfExperience;
    String bio;
    String facebookLink;
    String certificate;
    String cvUrl;

}
