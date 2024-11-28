package com.spring.dlearning.mapper.admin;

import com.spring.dlearning.dto.response.admin.Admin_TeacherResponse;
import com.spring.dlearning.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface Admin_TeacherMapper {
    @Mapping(source = "createdAt", target = "createdAt")
    @Mapping(source = "role.name", target = "role")
    Admin_TeacherResponse toTeacherResponse(User user);
}


