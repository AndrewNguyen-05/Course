package com.spring.dlearning.service;

import com.spring.dlearning.dto.request.UploadLessonRequest;
import com.spring.dlearning.dto.response.UploadLessonResponse;
import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.Lesson;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.LessonMapper;
import com.spring.dlearning.repository.CourseRepository;
import com.spring.dlearning.repository.LessonRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class LessonService {
    LessonRepository lessonRepository;
    LessonMapper lessonMapper;
    CourseRepository courseRepository;
    CloudinaryService cloudinaryService;

    @Transactional
    @PreAuthorize("isAuthenticated()")
    public UploadLessonResponse createLesson(UploadLessonRequest request, MultipartFile lessonVideo)
            throws IOException {

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new AppException(ErrorCode.COURSER_NOT_EXISTED));

        Lesson lesson = lessonMapper.toLesson(request);
        lesson.setCourse(course);

        String videoUrl = cloudinaryService.uploadVideoChunked(lessonVideo, "courses").get("url").toString();
        lesson.setVideoUrl(videoUrl);

        lessonRepository.save(lesson);

        return lessonMapper.toUploadLessonResponse(lesson);
    }
}
