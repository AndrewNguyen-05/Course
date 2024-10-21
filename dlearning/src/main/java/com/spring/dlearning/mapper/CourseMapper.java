package com.spring.dlearning.mapper;

import com.spring.dlearning.dto.request.CourseCreationRequest;
import com.spring.dlearning.dto.request.UploadCourseRequest;
import com.spring.dlearning.dto.response.CourseCreationResponse;
import com.spring.dlearning.dto.response.CourseResponse;
import com.spring.dlearning.dto.response.UploadCourseResponse;
import com.spring.dlearning.entity.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CourseMapper {

    @Mapping(source = "author.name", target = "author")
    @Mapping(target = "averageRating", ignore = true)
    CourseResponse toCourseResponse(Course course);

    Course toCourse(CourseCreationRequest courseRequest);

    @Mapping(source = "author.name", target = "author")
    CourseCreationResponse toCourseCreationResponse(Course course);

    Course updateCourse(UploadCourseRequest request);

    @Mapping(source = "author.name", target = "author")
    @Mapping(source = "thumbnail", target = "thumbnail")
    UploadCourseResponse toUploadCourseResponse(Course course);

}
