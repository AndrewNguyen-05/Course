package com.spring.dlearning.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UploadLessonResponse {

    Long userId;
    Long courseId;
    String courseTitle;
    Long lessonId;
    String lessonName;
    String description;
    String videoUrl;
}
