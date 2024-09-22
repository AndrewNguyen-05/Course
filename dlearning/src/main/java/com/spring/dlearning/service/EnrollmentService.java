package com.spring.dlearning.service;

import com.spring.dlearning.dto.request.BuyCourseRequest;
import com.spring.dlearning.dto.response.BuyCourseResponse;
import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.Enrollment;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.EnrollmentMapper;
import com.spring.dlearning.repository.CourseRepository;
import com.spring.dlearning.repository.EnrollmentRepository;
import com.spring.dlearning.repository.UserRepository;
import com.spring.dlearning.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class EnrollmentService {

    EnrollmentRepository enrollmentRepository;
    UserRepository userRepository;
    CourseRepository courseRepository;
    EnrollmentMapper enrollmentMapper;

    @PreAuthorize("isAuthenticated()")
    public List<BuyCourseResponse> getCourseByUserCurrent(){
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        List<Enrollment> enrollments = enrollmentRepository.findCourseByUser(user);

        return enrollments.stream().map(enrollmentMapper::toBuyCourseResponse).toList();
    }

    @Transactional
    @PreAuthorize("isAuthenticated()")
    public BuyCourseResponse buyCourse(BuyCourseRequest request){
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new AppException(ErrorCode.COURSER_NOT_EXISTED));

        boolean existedEnrollment = enrollmentRepository.existsByUserAndCourse(user, course);
        if(existedEnrollment) throw new AppException(ErrorCode.COURSE_ALREADY_PURCHASED);

        Long pointsCourse = Objects.requireNonNull(course.getPoint(), "Course points cannot be null");
        Long pointsUser = Objects.requireNonNull(user.getPoints(), "User points cannot be null");

        if(pointsUser < pointsCourse){
            throw new AppException(ErrorCode.BUY_COURSE_INVALID);
        }
        user.setPoints(pointsUser - pointsCourse);
        userRepository.save(user);

        Enrollment enrollment = Enrollment.builder()
                .user(user)
                .course(course)
                .build();

        enrollmentRepository.save(enrollment);
        return enrollmentMapper.toBuyCourseResponse(enrollment);
    }

}
