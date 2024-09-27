package com.spring.dlearning.mapper;


import com.spring.dlearning.dto.response.FavoriteResponse;
import com.spring.dlearning.entity.Favorite;
import org.springframework.stereotype.Component;

@Component
public class FavoriteMapper {

    public  FavoriteResponse toFavoriteResponse(Favorite favorite){
        return FavoriteResponse.builder()
                .name(favorite.getUser().getName())
                .favoriteId(favorite.getId())
                .courseId(favorite.getCourse().getId())
                .title(favorite.getCourse().getTitle())
                .thumbnail(favorite.getCourse().getThumbnail())
                .points(favorite.getCourse().getPoints())
                .author(favorite.getCourse().getAuthor().getName())
                .build();
    }
}
