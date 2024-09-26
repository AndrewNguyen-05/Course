package com.spring.dlearning.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.spring.dlearning.utils.CourseLevel;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CourseResponse {

    Long id;
    String author;
    String title;
    String description;
    Integer duration;
    String language;
    CourseLevel courseLevel;
    String thumbnail;
    String videoUrl;
    Double averageRating;
    Long points;

    Set<String> lessonName =  new HashSet<>();

}
