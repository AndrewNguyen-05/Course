package com.spring.dlearning.dto.request;

import com.spring.dlearning.utils.CourseLevel;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseRequest {
    String title;
    String description;
    Integer duration;
    String language;
    CourseLevel courseLevel;
    BigDecimal price;
    String thumbnail;
    String videoUrl;

}
