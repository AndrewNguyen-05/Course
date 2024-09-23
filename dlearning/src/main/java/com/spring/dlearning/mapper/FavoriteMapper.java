package com.spring.dlearning.mapper;

import com.spring.dlearning.dto.response.FavoriteResponse;
import com.spring.dlearning.entity.Favorite;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FavoriteMapper {

    @Mapping(source = "course.id", target = "courseId")
    @Mapping(source = "user.name", target = "name")
    @Mapping(source = "course.author.name", target = "author")
    @Mapping(source = "course.title", target = "title")
    @Mapping(source = "course.thumbnail", target = "thumbnail")
    @Mapping(source = "course.points", target = "points")
    FavoriteResponse toFavoriteResponse(Favorite favorite);
}
