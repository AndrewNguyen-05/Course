package com.spring.dlearning.mapper;


import com.spring.dlearning.dto.request.UserCreationRequest;
import com.spring.dlearning.dto.response.UserResponse;
import com.spring.dlearning.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toUser(UserCreationRequest request);
    UserResponse toUserResponse(User user);
}
