package com.spring.dlearning.service;

import com.spring.dlearning.constant.PredefinedRole;
import com.spring.dlearning.dto.response.InfoTeacherByCourseResponse;
import com.spring.dlearning.dto.response.PageResponse;
import com.spring.dlearning.dto.response.StudentResponse;
import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.Enrollment;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.repository.CourseRepository;
import com.spring.dlearning.repository.EnrollmentRepository;
import com.spring.dlearning.repository.UserRepository;
import com.spring.dlearning.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class TeacherService {

    CourseRepository courseRepository;
    EnrollmentRepository enrollmentRepository;
    UserRepository userRepository;

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

    public PageResponse<StudentResponse> getStudentsByPurchasedCourses(int page, int size) {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if(! Objects.equals(user.getRole().getName(), PredefinedRole.TEACHER_ROLE)) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Enrollment> enrollments = enrollmentRepository.findPurchasedUsersByTeacherId(user.getId(), pageable);

        return PageResponse.<StudentResponse>builder()
                .pageSize(size)
                .currentPage(page)
                .totalElements(enrollments.getTotalElements())
                .totalPages(enrollments.getTotalPages())
                .data(enrollments.getContent().stream().map(enrollment -> StudentResponse.builder()
                        .name(enrollment.getUser().getName())
                        .email(enrollment.getUser().getEmail())
                        .avatar(enrollment.getUser().getAvatar())
                        .courseName(enrollment.getCourse().getTitle())
                        .createAt(enrollment.getCreatedAt())
                        .build()).toList())
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