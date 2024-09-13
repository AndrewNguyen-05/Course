package com.spring.dlearning.mapper;

import com.spring.dlearning.dto.request.CommentRequest;
import com.spring.dlearning.dto.request.UpdateCommentRequest;
import com.spring.dlearning.dto.response.CommentResponse;
import com.spring.dlearning.dto.response.UpdateCommentResponse;
import com.spring.dlearning.entity.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    @Mapping(source = "user.name", target = "name")
    @Mapping(source = "user.avatar", target = "avatar")
    @Mapping(source = "replies", target = "replies")
    CommentResponse toCommentResponse(Comment comment);

    Comment toComment(UpdateCommentRequest request, @MappingTarget Comment comment);

    UpdateCommentResponse toUpdateResponse(Comment comment);
}
