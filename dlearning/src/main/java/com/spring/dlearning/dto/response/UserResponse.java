package com.spring.dlearning.dto.response;

import com.spring.dlearning.entity.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {

    String email;
    String firstName;
    String lastName;
    LocalDate dob;
    Boolean noPassword;
    Set<Role> roles = new HashSet<>();

}
