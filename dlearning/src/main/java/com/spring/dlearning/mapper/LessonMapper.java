package com.spring.dlearning.mapper;

import com.spring.dlearning.dto.request.UploadLessonRequest;
import com.spring.dlearning.dto.response.UploadLessonResponse;
import com.spring.dlearning.entity.Lesson;
import com.spring.dlearning.entity.LessonContent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LessonMapper {

    @Mapping(source = "courseId", target = "course.id")
    @Mapping(source = "lessonName", target = "lessonName")
    @Mapping(source = "description", target = "description")
    Lesson toLesson(UploadLessonRequest request);

    @Mapping(target = "userId", source = "course.author.id")
    @Mapping(target = "courseId", source = "course.id")
    @Mapping(target = "courseTitle", source = "course.title")
    @Mapping(target = "lessonId", source = "id")
    @Mapping(target = "lessonContents", source = "lessonContents")
    UploadLessonResponse toUploadLessonResponse(Lesson lesson);

    // Phương thức ánh xạ từ LessonContent sang LessonContentDto
    @Mapping(target = "contentId", source = "id")
    @Mapping(target = "contentType", source = "contentType")
    @Mapping(target = "contentUrl", source = "contentUrl")
    @Mapping(target = "contentDescription", source = "description")
    UploadLessonResponse.LessonContentDto toLessonContentDto(LessonContent lessonContent);
}

