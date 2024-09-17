package com.spring.dlearning.mapper;

import com.spring.dlearning.dto.request.BuyCourseRequest;
import com.spring.dlearning.dto.response.BuyCourseResponse;
import com.spring.dlearning.entity.Enrollment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EnrollmentMapper {

    @Mapping(source = "title", target = "course.title")
    @Mapping(source = "price", target = "course.price")
    @Mapping(source = "createAt", target = "course.createdAt")
    Enrollment toEnrollment(BuyCourseRequest request);

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "courseId", source ="course.id")
    @Mapping(target = "title", source = "course.title")
    @Mapping(target = "price", source = "course.price")
    @Mapping(target = "createAt", source = "course.createdAt")
    BuyCourseResponse toBuyCourseRequest(Enrollment enrollment);

}
