package com.spring.dlearning.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseLessonResponse {

    Long courseId;
    String courseTitle;
    String courseDescription;

    @Builder.Default
    Set<LessonDto> lessons = new HashSet<>();

    @Setter
    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class LessonDto{
        Long lessonId;
        String lessonName;
        String lessonDescription;

        @Builder.Default
        Set<LessonContentDto> lessonContentDto = new HashSet<>();
    }

    @Setter
    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class LessonContentDto{
        Long contentId;
        String contentType;
        String contentUrl;
        String contentDescription;

    }

}
