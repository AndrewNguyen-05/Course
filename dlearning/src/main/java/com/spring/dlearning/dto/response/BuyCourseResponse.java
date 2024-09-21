package com.spring.dlearning.dto.response;

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
    Long userId;
    Long courseId;
    String author;
    String title;
    Long points;
    LocalDateTime createAt;
}
