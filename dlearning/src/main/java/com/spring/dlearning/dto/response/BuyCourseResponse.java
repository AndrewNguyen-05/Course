package com.spring.dlearning.dto.response;

import com.spring.dlearning.utils.CourseLevel;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BuyCourseResponse {
    Long courseId;
    String title;
    String author;
    CourseLevel courseLevel;
    String thumbnail;
    Long points;
    LocalDateTime createAt;
}
