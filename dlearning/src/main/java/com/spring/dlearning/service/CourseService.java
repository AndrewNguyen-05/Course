package com.spring.dlearning.service;

import com.spring.dlearning.dto.request.BuyCourseRequest;
import com.spring.dlearning.dto.request.CourseRequest;
import com.spring.dlearning.dto.request.UploadCourseRequest;
import com.spring.dlearning.dto.response.BuyCourseResponse;
import com.spring.dlearning.dto.response.CourseResponse;
import com.spring.dlearning.dto.response.PageResponse;
import com.spring.dlearning.dto.response.UploadCourseResponse;
import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.CourseMapper;
import com.spring.dlearning.repository.CourseRepository;
import com.spring.dlearning.repository.UserRepository;
import com.spring.dlearning.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CourseService {

    UserRepository userRepository;
    CourseRepository courseRepository;
    CloudinaryService cloudinaryService;
    CourseMapper courseMapper;

    public PageResponse<CourseResponse> getAllCourses(Specification<Course> spec, int page, int size) {

        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Course> pageData = courseRepository.findAll(spec, pageable);

        return PageResponse.<CourseResponse>builder()
                .currentPage(page)
                .pageSize(pageable.getPageSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent().stream().map(courseMapper::toCourseResponse).toList())
                .build();
    }

    public List<String> getTitleSuggestions(String query) {
        return courseRepository.findTitleSuggestions(query);
    }

    public CourseResponse getCourseById(Long id){
        return courseRepository.findById(id).map(courseMapper::toCourseResponse)
                .orElseThrow(() -> new AppException(ErrorCode.COURSER_NOT_EXISTED));
    }

    @Transactional
    @PreAuthorize("isAuthenticated() and hasAnyAuthority('TEACHER', 'ADMIN')")
    public CourseResponse createCourse(CourseRequest request){
        Course course = courseMapper.toCourse(request);

        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        course.setAuthor(user);

        courseRepository.save(course);

        return courseMapper.toCourseResponse(course);
    }

    @PreAuthorize("isAuthenticated() and hasAnyAuthority('TEACHER', 'USER', 'ADMIN')")
    public List<CourseResponse> myCourses(){
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        List<Course> myCourse = courseRepository.findByAuthor(user);

        return myCourse.stream().map(courseMapper::toCourseResponse).toList();
    }

    public UploadCourseResponse uploadCourse(UploadCourseRequest request, MultipartFile file)
            throws IOException {

        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        String videoUrl = cloudinaryService.uploadVideoChunked(file, "courses").get("url").toString();

        Course course = courseMapper.updateCourse(request);
        course.setVideoUrl(videoUrl);
        course.setAuthor(user);

        courseRepository.save(course);

        return courseMapper.toUploadCourseResponse(course);
    }

}
