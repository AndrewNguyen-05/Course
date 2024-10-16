package com.spring.dlearning.mapper;


import com.spring.dlearning.dto.request.UserProfileRequest;
import com.spring.dlearning.dto.response.UserProfileResponse;
import com.spring.dlearning.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    void updateUser(UserProfileRequest request, @MappingTarget User user);

    UserProfileResponse getInfoUser(User user);
}
