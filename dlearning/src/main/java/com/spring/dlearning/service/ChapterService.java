package com.spring.dlearning.service;

import com.spring.dlearning.dto.request.CreationChapterRequest;
import com.spring.dlearning.dto.response.CreationChapterResponse;
import com.spring.dlearning.entity.Chapter;
import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.ChapterMapper;
import com.spring.dlearning.repository.ChapterRepository;
import com.spring.dlearning.repository.CourseRepository;
import com.spring.dlearning.repository.UserRepository;
import com.spring.dlearning.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ChapterService {

    ChapterRepository chapterRepository;
    ChapterMapper chapterMapper;
    UserRepository userRepository;
    CourseRepository courseRepository;

    @Transactional
    @PreAuthorize("isAuthenticated() and hasAnyAuthority('ADMIN', 'TEACHER')")
    public CreationChapterResponse createChapter(CreationChapterRequest request) {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_EXISTED));

        Chapter chapter = chapterMapper.toLesson(request);
        chapter.setCourse(course);
        chapterRepository.save(chapter);

        return CreationChapterResponse.builder()
                .userName(user.getName())
                .courseId(course.getId())
                .chapterId(chapter.getId())
                .chapterName(chapter.getChapterName())
                .description(chapter.getDescription())
                .lessons(chapter.getLessons().stream()
                        .map(lesson ->
                                CreationChapterResponse.
                                        LessonDto.builder()
                                        .lessonId(lesson.getId())
                                        .lessonName(lesson.getLessonName())
                                        .lessonDescription(lesson.getDescription())
                                        .videoUrl(lesson.getVideoUrl())
                                        .build())
                        .collect(Collectors.toSet())
                )
                .build();
    }
}
