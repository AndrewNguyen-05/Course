package com.spring.dlearning.mapper;

import com.spring.dlearning.dto.response.CourseResponse;
import com.spring.dlearning.entity.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CourseMapper {

    @Mapping(source = "author.name", target = "author")
    CourseResponse toCourseResponse(Course course);
}
