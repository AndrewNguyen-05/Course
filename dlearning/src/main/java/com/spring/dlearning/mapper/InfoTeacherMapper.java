package com.spring.dlearning.mapper;

import com.spring.dlearning.dto.response.CourseLessonResponse;
import com.spring.dlearning.dto.response.InfoTeacherByCourseResponse;
import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.Review;
import com.spring.dlearning.repository.CourseRepository;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Set;

@Component
public class InfoTeacherMapper {

    CourseRepository courseRepository;

    public InfoTeacherMapper(CourseRepository courseRepository){
        this.courseRepository = courseRepository;
    }

    public InfoTeacherByCourseResponse mapToInfoTeacherByCourseResponse(Course course){


        return InfoTeacherByCourseResponse.builder()
                .id(course.getId())
                .author(course.getAuthor().getName())
                .rating(getAverageRating(course.getComments()))
                .courseAmount(courseRepository.findByAuthor(course.getAuthor()).size())
                .reviewAmount(course.getComments().size())
                .description(course.getDescription())
                .build();
    }

    public BigDecimal getAverageRating(Set<Review> reviews){
        int sum = reviews.stream().mapToInt(Review::getRating).sum();

        return BigDecimal.valueOf(sum).divide(BigDecimal.valueOf(reviews.size()), 1, RoundingMode.HALF_UP);
    }
}
