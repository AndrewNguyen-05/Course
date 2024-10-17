package com.spring.dlearning.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewLessonRequest {

    @Size(max = 500, message = "CONTENT_INVALID")
    String content;
    Long parentReviewId;
    Long courseId;
    Long chapterId;
    Long lessonId;
}
