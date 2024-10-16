package com.spring.dlearning.service;

import com.spring.dlearning.dto.request.CreationChapterRequest;
import com.spring.dlearning.dto.response.CreationChapterResponse;
import com.spring.dlearning.entity.Chapter;
import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.Lesson;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.ChapterMapper;
import com.spring.dlearning.repository.ChapterRepository;
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
public class ChapterService {

    ChapterRepository chapterRepository;
    ChapterMapper chapterMapper;
    CourseRepository courseRepository;
    CloudinaryService cloudinaryService;
    LessonRepository lessonRepository;

    @Transactional
    @PreAuthorize("isAuthenticated() and hasAnyAuthority('ADMIN', 'TEACHER')")
    public CreationChapterResponse createChapter(CreationChapterRequest request, MultipartFile lessonVideo) throws IOException {

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new AppException(ErrorCode.COURSER_NOT_EXISTED));

        Chapter chapter = chapterRepository.findByChapterNameAndCourse(request.getChapterName(), course)
                .orElseGet(() -> {
                    Chapter newChapter = chapterMapper.toLesson(request);
                    newChapter.setCourse(course);
                    chapterRepository.save(newChapter);
                    return newChapter;
                });

        String videoUrl = cloudinaryService.uploadVideoChunked(lessonVideo, "courses").get("url").toString();

        Lesson lesson = Lesson.builder()
                .chapter(chapter)
                .contentType("video")
                .videoUrl(videoUrl)
                .lessonName(request.getLessonName())
                .description("Video content for the lesson")
                .build();

        lessonRepository.save(lesson);

        // Thêm LessonContent mới vào lesson
        chapter.getLessons().add(lesson);

        return chapterMapper.toCreateChapterResponse(chapter);
    }

}
