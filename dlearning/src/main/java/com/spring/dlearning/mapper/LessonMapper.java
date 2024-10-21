package com.spring.dlearning.mapper;

import com.spring.dlearning.dto.response.CommentLessonResponse;
import com.spring.dlearning.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LessonMapper {

    @Mapping(target = "courseId", source = "course.id")
    @Mapping(target = "chapterId", source = "chapter.id")
    @Mapping(target = "lessonId", source = "lesson.id")
    @Mapping(target = "content", source = "content")
    @Mapping(target = "name", source = "user.name")
    @Mapping(target = "avatar", source = "user.avatar")
    @Mapping(target = "reviewId", source = "id")
    CommentLessonResponse toCommentLessonResponse(Review review);

}
