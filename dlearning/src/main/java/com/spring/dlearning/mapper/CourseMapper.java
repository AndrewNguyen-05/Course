package com.spring.dlearning.mapper;

import com.spring.dlearning.dto.request.CourseRequest;
import com.spring.dlearning.dto.request.UploadCourseRequest;
import com.spring.dlearning.dto.response.CourseResponse;
import com.spring.dlearning.dto.response.UploadCourseResponse;
import com.spring.dlearning.entity.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CourseMapper {

    @Mapping(source = "author.name", target = "author")
    CourseResponse toCourseResponse(Course course);

    Course toCourse(CourseRequest courseRequest);


    Course updateCourse(UploadCourseRequest request);

    @Mapping(source = "author.name", target = "author")
    UploadCourseResponse toUploadCourseResponse(Course course);
}
