package com.spring.dlearning.mapper;

import com.spring.dlearning.dto.response.ReviewResponse;
import com.spring.dlearning.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(source = "user.name", target = "name")
    @Mapping(source = "user.avatar", target = "avatar")
    @Mapping(source = "replies", target = "replies")
    ReviewResponse toCommentResponse(Review comment);

}
