package com.spring.dlearning.mapper;

import com.spring.dlearning.dto.response.BuyCourseResponse;
import com.spring.dlearning.entity.Enrollment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EnrollmentMapper {

    @Mapping(target = "courseLevel", source = "course.courseLevel")
    @Mapping(target = "courseId", source ="course.id")
    @Mapping(target = "title", source = "course.title")
    @Mapping(target = "points", source = "course.point")
    @Mapping(target = "author", source = "course.author.name")
    @Mapping(target = "thumbnail", source = "course.thumbnail")
    @Mapping(target = "createAt", source = "course.createdAt")
    BuyCourseResponse toBuyCourseResponse(Enrollment enrollment);

}
