package com.spring.dlearning.service.admin;

import com.spring.dlearning.dto.response.admin.Admin_CourseResponse;
import com.spring.dlearning.entity.Course;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.admin.Admin_CourseMapper;
import com.spring.dlearning.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;


@Service
@RequiredArgsConstructor
public class Admin_CourseService {

    private final CourseRepository courseRepository;
    private final Admin_CourseMapper courseMapper;

    /**
     * Lấy danh sách toàn bộ khóa học
     */
    public Page<Admin_CourseResponse> getAllCourses(Pageable pageable) {
        return courseRepository.findAll(pageable)
                .map(courseMapper::toCourseResponse);
    }

    /**
     * Tìm kiếm khóa học dựa trên từ khóa
     */
    public Page<Admin_CourseResponse> searchCoursesByKeywords(String[] keywords, Pageable pageable) {
        return courseRepository.searchByMultipleKeywords(keywords, pageable)
                .map(courseMapper::toCourseResponse);
    }

    /**
     * Ban một khóa học (đặt trạng thái enabled = false)
     */
    @Transactional
    public void banCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        if (!course.getEnabled()) {
            throw new AppException(ErrorCode.COURSE_ALREADY_BANNED);
        }

        course.setEnabled(false);
        courseRepository.save(course);
    }

    /**
     * Unban một khóa học (đặt trạng thái enabled = true)
     */
    @Transactional
    public void unbanCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        if (course.getEnabled()) {
            throw new AppException(ErrorCode.COURSE_NOT_BANNED);
        }

        course.setEnabled(true);
        courseRepository.save(course);
    }

    /**
     * Lấy danh sách các khóa học bị ban
     */
    public Page<Admin_CourseResponse> getBannedCourses(Pageable pageable) {
        return courseRepository.findByEnabled(false, pageable)
                .map(courseMapper::toCourseResponse);
    }

    /**
     * Lấy danh sách các khóa học đang hoạt động
     */
    public Page<Admin_CourseResponse> getActiveCourses(Pageable pageable) {
        return courseRepository.findByEnabled(true, pageable)
                .map(courseMapper::toCourseResponse);
    }

    /**
     * Lấy chi tiết của một khóa học
     */
    public Admin_CourseResponse getCourseDetails(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        return Admin_CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .enabled(course.getEnabled())
                .authorId(course.getAuthor() != null ? course.getAuthor().getId() : null) // Thêm authorId
                .authorName(course.getAuthor() != null ? course.getAuthor().getName() : null)
                .language(course.getLanguage())
                .level(course.getCourseLevel().toString())
                .duration(course.getDuration())
                .points(course.getPoints())
                .thumbnail(course.getThumbnail()) // Thêm trường này
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }



}


