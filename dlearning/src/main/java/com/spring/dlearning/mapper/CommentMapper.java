package com.spring.dlearning.mapper;

import com.spring.dlearning.dto.response.CommentResponse;
import com.spring.dlearning.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    @Mapping(source = "user.name", target = "name")
    @Mapping(source = "user.avatar", target = "avatar")
    @Mapping(source = "replies", target = "replies")
    CommentResponse toCommentResponse(Review comment);

}
