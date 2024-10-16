package com.spring.dlearning.mapper;

import com.spring.dlearning.dto.request.CreationChapterRequest;
import com.spring.dlearning.dto.response.CreationChapterResponse;
import com.spring.dlearning.entity.Chapter;
import com.spring.dlearning.entity.Lesson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ChapterMapper {

    @Mapping(source = "courseId", target = "course.id")
    @Mapping(source = "chapterName", target = "chapterName")
    @Mapping(source = "description", target = "description")
    Chapter toLesson(CreationChapterRequest request);

    @Mapping(target = "userId", source = "course.author.id")
    @Mapping(target = "courseId", source = "course.id")
    @Mapping(target = "courseTitle", source = "course.title")
    @Mapping(target = "chapterId", source = "id")
    @Mapping(target = "lessons", source = "lessons")
    CreationChapterResponse toCreateChapterResponse(Chapter chapter);

    @Mapping(target = "lessonId", source = "id")
    @Mapping(target = "lessonName", source = "lessonName")
    @Mapping(target = "videoUrl", source = "videoUrl")
    @Mapping(target = "lessonDescription", source = "description")
    CreationChapterResponse.LessonDto toLessonDto(Lesson lesson);
}

