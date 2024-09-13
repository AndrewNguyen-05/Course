package com.spring.dlearning.mapper;

import com.spring.dlearning.dto.request.CommentRequest;
import com.spring.dlearning.dto.response.CommentResponse;
import com.spring.dlearning.entity.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    @Mapping(source = "courseId", target = "course.id")
    Comment toComment(CommentRequest request);

    @Mapping(source = "user.name", target = "name")
    @Mapping(source = "user.avatar", target = "avatar")
    @Mapping(source = "replies", target = "replies")
    CommentResponse toCommentResponse(Comment comment);
}
