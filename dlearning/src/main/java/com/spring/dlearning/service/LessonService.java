package com.spring.dlearning.service;

import com.spring.dlearning.constant.PredefinedRole;
import com.spring.dlearning.dto.request.LessonCreationRequest;
import com.spring.dlearning.dto.response.LessonCreationResponse;
import com.spring.dlearning.entity.Chapter;
import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.Lesson;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.repository.ChapterRepository;
import com.spring.dlearning.repository.CourseRepository;
import com.spring.dlearning.repository.LessonRepository;
import com.spring.dlearning.repository.UserRepository;
import com.spring.dlearning.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class LessonService {

    LessonRepository lessonRepository;
    ChapterRepository chapterRepository;
    CourseRepository courseRepository;
    CloudinaryService cloudinaryService;
    UserRepository userRepository;

    @Transactional
    @PreAuthorize("isAuthenticated() and hasAuthority('TEACHER')")
    public LessonCreationResponse createLesson(LessonCreationRequest request, MultipartFile video)
            throws IOException {
        var email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if(! Objects.equals(user.getRole().getName(), PredefinedRole.TEACHER_ROLE)){
            throw new AppException(ErrorCode.ACCESSDENIED);
        }

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_EXISTED));

        Chapter chapter = chapterRepository.findById(request.getChapterId())
                .orElseThrow(() -> new AppException(ErrorCode.CHAPTER_NOT_EXIST));

        String videoUrl = cloudinaryService.uploadVideoChunked(video, "courses").get("url").toString();

        Lesson lesson = Lesson.builder()
                .chapter(chapter)
                .lessonName(request.getLessonName())
                .description(request.getDescription())
                .videoUrl(videoUrl)
                .build();

        lessonRepository.save(lesson);

        return LessonCreationResponse.builder()
                .courseId(course.getId())
                .chapterId(chapter.getId())
                .lessonName(request.getLessonName())
                .videoUrl(lesson.getVideoUrl())
                .lessonDescription(lesson.getDescription())
                .build();
    }
}
