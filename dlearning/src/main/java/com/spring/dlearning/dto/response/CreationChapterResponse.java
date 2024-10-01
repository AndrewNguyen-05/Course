package com.spring.dlearning.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreationChapterResponse {

    Long userId;
    Long courseId;
    String courseTitle;
    Long chapterId;
    String chapterName;
    String description;

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
        String videoUrl;
        String lessonDescription;
    }
}
