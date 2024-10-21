package com.spring.dlearning.mapper;

import com.spring.dlearning.dto.response.CourseChapterResponse;
import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.Chapter;
import com.spring.dlearning.entity.Lesson;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.repository.CourseRepository;
import org.springframework.stereotype.Component;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public final class CourseChapterAndLessonMapper {

    CourseRepository courseRepository;

    public CourseChapterAndLessonMapper(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public CourseChapterResponse getCourserChapterAndLesson(Long courseId){
        Course course =  courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_EXISTED));

        Set<CourseChapterResponse.ChapterDto> chapterDto = course.getChapters().stream()
                .map(this::mapToLessonDto)
                .collect(Collectors.toSet());

        return CourseChapterResponse.builder()
                .courseId(course.getId())
                .courseTitle(course.getTitle())
                .courseDescription(course.getDescription())
                .chapters(chapterDto)
                .build();
    }

    private CourseChapterResponse.ChapterDto mapToLessonDto(Chapter chapter) {
        Set<CourseChapterResponse.LessonDto> lessonDto = chapter.getLessons().stream()
                .map(this::mapToLessonDto)
                .collect(Collectors.toSet());

        return CourseChapterResponse.ChapterDto.builder()
                .chapterId(chapter.getId())
                .chapterName(chapter.getChapterName())
                .lessonDto(lessonDto)
                .build();
    }

    private CourseChapterResponse.LessonDto mapToLessonDto(Lesson lesson) {
        return CourseChapterResponse.LessonDto.builder()
                .lessonId(lesson.getId())
                .lessonName(lesson.getLessonName())
                .videoUrl(lesson.getVideoUrl())
                .build();
    }

}
