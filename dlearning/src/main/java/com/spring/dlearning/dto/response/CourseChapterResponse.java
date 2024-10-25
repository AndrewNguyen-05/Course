package com.spring.dlearning.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.Collections;
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
    Set<ChapterDto> chapters = Collections.emptySet();

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
        Set<LessonDto> lessonDto = Collections.emptySet();
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
        String description;
        String videoUrl;
    }

}
