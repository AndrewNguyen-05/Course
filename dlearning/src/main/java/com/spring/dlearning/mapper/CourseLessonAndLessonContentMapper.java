package com.spring.dlearning.mapper;

import com.spring.dlearning.dto.response.CourseLessonResponse;
import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.Lesson;
import com.spring.dlearning.entity.LessonContent;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public final class CourseLessonAndLessonContentMapper {

    @Autowired
    CourseRepository courseRepository;

    public CourseLessonResponse getCourserLessonAndLessonContent(Long courseId){
        Course course =  courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSER_NOT_EXISTED));

        // Lấy danh sách bài học (Lesson) từ đối tượng khóa học (Course)
        Set<CourseLessonResponse.LessonDto> lessonDtos = course.getLessons().stream()
                .map(this::mapToLessonDto)
                .collect(Collectors.toSet());

        return CourseLessonResponse.builder()
                .courseId(course.getId())
                .courseTitle(course.getTitle())
                .courseDescription(course.getDescription())
                .lessons(lessonDtos)
                .build();
    }

    private CourseLessonResponse.LessonDto mapToLessonDto(Lesson lesson) {
        Set<CourseLessonResponse.LessonContentDto> lessonContentDtos = lesson.getLessonContents().stream()
                .map(this::mapToLessonContentDto)
                .collect(Collectors.toSet());

        return CourseLessonResponse.LessonDto.builder()
                .lessonId(lesson.getId())
                .lessonName(lesson.getLessonName())
                .lessonDescription(lesson.getDescription())
                .lessonContentDto(lessonContentDtos)
                .build();
    }


    // Chuyển đổi từng nội dung bài học(LessonContent) sang đối tượng trả về(LessonContentDto)
    private CourseLessonResponse.LessonContentDto mapToLessonContentDto(LessonContent lessonContent) {
        return CourseLessonResponse.LessonContentDto.builder()
                .contentId(lessonContent.getId())
                .contentType(lessonContent.getContentType())
                .contentUrl(lessonContent.getContentUrl())
                .contentDescription(lessonContent.getDescription())
                .build();
    }

}
