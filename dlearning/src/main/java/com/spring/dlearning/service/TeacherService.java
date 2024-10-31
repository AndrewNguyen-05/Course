package com.spring.dlearning.service;

import com.spring.dlearning.dto.response.InfoTeacherByCourseResponse;
import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.repository.CourseRepository;
import com.spring.dlearning.repository.EnrollmentRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class TeacherService {

    CourseRepository courseRepository;
    EnrollmentRepository enrollmentRepository;

    public InfoTeacherByCourseResponse infoTeacherByCourseId(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_EXISTED));

        User user = course.getAuthor();

        int totalReview = courseRepository.totalReview(user.getId());
        int totalStudent = enrollmentRepository.totalStudentsByTeacher(course.getAuthor().getId());
        int totalCourse = user.getCourses().size();

        return InfoTeacherByCourseResponse.builder()
                .userId(user.getId())
                .name(course.getAuthor().getName())
                .courseAmount(totalCourse)
                .avatar(course.getAuthor().getAvatar())
                .avgRating(avgRating(user))
                .reviewAmount(totalReview)
                .studentAmount(totalStudent)
                .description(user.getDescription())
                .build();
    }

    private BigDecimal avgRating (User user) {
        long countRating = user.getReviews().stream().filter(review -> review.getRating() != 0)
                .count();

        BigDecimal totalRating = user.getReviews()
                .stream()
                .filter(review -> review.getRating() != 0)
                .map(review -> BigDecimal.valueOf(review.getRating()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return countRating > 0
                ?
                totalRating.divide(BigDecimal.valueOf(countRating), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
    }

}