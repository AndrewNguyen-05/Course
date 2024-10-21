package com.spring.dlearning.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.spring.dlearning.utils.CourseLevel;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseCreationResponse {

    Long id;
    String author;
    String title;
    String description;
    Integer duration;
    String language;
    CourseLevel courseLevel;
    String thumbnail;
    String videoUrl;
    Long points;
}
