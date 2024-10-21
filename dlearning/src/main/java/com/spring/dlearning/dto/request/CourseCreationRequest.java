package com.spring.dlearning.dto.request;

import com.spring.dlearning.utils.CourseLevel;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseCreationRequest {
    String title;
    String description;
    Integer duration;
    String language;
    CourseLevel courseLevel;
    Long points;

}
