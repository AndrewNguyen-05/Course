package com.spring.dlearning.mapper;

import com.spring.dlearning.dto.request.CommentRequest;
import com.spring.dlearning.dto.request.UpdateCommentRequest;
import com.spring.dlearning.dto.response.CommentResponse;
import com.spring.dlearning.entity.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    Comment toComment (CommentRequest request);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "postId", source = "post.id")
    @Mapping(target = "name", source = "user.name")
    @Mapping(target = "avatar", source = "user.avatar")
    @Mapping(target = "replies", source = "replies")
    CommentResponse toCommentResponse (Comment comment);

    void updateComment(UpdateCommentRequest request, @MappingTarget Comment comment);

}
