package com.spring.dlearning.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentLessonRequest {
    Long courseId;
    Long chapterId;
    Long lessonId;
    String content;
    Long parentReviewId;
}
