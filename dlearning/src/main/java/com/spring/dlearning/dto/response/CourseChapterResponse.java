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
public class CourseChapterResponse {

    Long courseId;
    String courseTitle;
    String courseDescription;

    @Builder.Default
    Set<ChapterDto> chapters = new HashSet<>();

    @Setter
    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class ChapterDto{
        Long chapterId;
        String chapterName;

        @Builder.Default
        Set<LessonDto> lessonDto = new HashSet<>();
    }

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
    }

}
