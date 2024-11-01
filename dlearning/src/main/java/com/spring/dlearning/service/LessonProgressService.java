package com.spring.dlearning.service;

import com.spring.dlearning.dto.request.LessonProgressRequest;
import com.spring.dlearning.dto.response.LessonProgressResponse;
import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.Lesson;
import com.spring.dlearning.entity.LessonProgress;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.repository.*;
import com.spring.dlearning.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class LessonProgressService {

    LessonProgressRepository lessonProgressRepository;
    UserRepository userRepository;
    CourseRepository courseRepository;
    EnrollmentRepository enrollmentRepository;
    LessonRepository lessonRepository;

    public BigDecimal calculateCompletion(Long courseId) {

        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_EXISTED));

        if (!enrollmentRepository.existsByUserAndCourse(user, course)) {
            throw new AppException(ErrorCode.COURSE_ACCESS_DENIED);
        }

        int totalLesson = course.getChapters().stream()
                .mapToInt(chapter -> chapter.getLessons().size())
                .sum();

        long completedLessons = lessonProgressRepository.countByUserAndCourseAndCompleted(user, course, true);

        if (totalLesson == 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal completed = BigDecimal.valueOf(completedLessons);
        BigDecimal totalLessons = BigDecimal.valueOf(totalLesson);
        BigDecimal percentage = completed.divide(totalLessons, 1, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));

        return percentage;
    }

    @PreAuthorize("isAuthenticated()")
    @Transactional
    public LessonProgressResponse markLessonAsCompleted(LessonProgressRequest request) {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_EXIST));

        Course course = lesson.getChapter().getCourse();

        if (!enrollmentRepository.existsByUserAndCourse(user, course)) {
            throw new AppException(ErrorCode.COURSE_ACCESS_DENIED);
        }

        LessonProgress existingProgress = lessonProgressRepository.findByUserAndLesson(user, lesson);
        if (existingProgress != null) {
            return LessonProgressResponse.builder()
                    .lessonId(existingProgress.getLesson().getId())
                    .lessonName(existingProgress.getLesson().getLessonName())
                    .isComplete(existingProgress.getCompleted())
                    .build();
        }

        lessonProgressRepository.save(LessonProgress.builder()
                .user(user)
                .lesson(lesson)
                .completed(true)
                .build());

        return LessonProgressResponse.builder()
                .lessonId(lesson.getId())
                .lessonName(lesson.getLessonName())
                .isComplete(true)
                .build();
    }

}
