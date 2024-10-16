package com.spring.dlearning.mapper;

import com.spring.dlearning.dto.request.UserRegisterTeacherRequest;
import com.spring.dlearning.dto.response.UserRegisterTeacherResponse;
import com.spring.dlearning.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RegisterTeacherMapper {

    void toUpdateTeacher(UserRegisterTeacherRequest request, @MappingTarget User user);

    UserRegisterTeacherResponse toTeacherResponse(User user);
}
