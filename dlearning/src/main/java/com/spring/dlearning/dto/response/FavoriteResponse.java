package com.spring.dlearning.dto.response;

import com.spring.dlearning.utils.CourseLevel;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;


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
    BigDecimal price;
}
