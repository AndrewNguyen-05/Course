package com.spring.dlearning.mapper;

import com.spring.dlearning.dto.request.PostCreationRequest;
import com.spring.dlearning.dto.response.PostCreationResponse;
import com.spring.dlearning.entity.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PostMapper {

    Post toPost(PostCreationRequest request);

    @Mapping(target = "name", source = "user.name")
    @Mapping(target = "avatar", source = "user.avatar")
    PostCreationResponse toPostCreationResponse(Post post);
}
