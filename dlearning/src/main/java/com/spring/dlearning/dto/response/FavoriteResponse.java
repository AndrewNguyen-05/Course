package com.spring.dlearning.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FavoriteResponse {

    Integer id;
    String name;

    Long courseId;
    String author;
    String title;
    String thumbnail;
    Long points;
}
