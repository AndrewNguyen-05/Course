package com.spring.dlearning.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UploadLessonRequest {

    @NotNull(message = "COURSE_ID_INVALID")
    Long courseId;
    String lessonName;
    String description;

}
