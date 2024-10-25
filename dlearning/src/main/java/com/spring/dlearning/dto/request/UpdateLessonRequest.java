package com.spring.dlearning.dto.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateLessonRequest {
    Long courseId;
    Long chapterId;
    Long lessonId;
    String lessonName;
    String description;
}
