package com.spring.dlearning.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "lesson_contents")
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LessonContent extends AbstractEntity<Long> {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lesson_id", nullable = false)
    Lesson lesson;

    @Column(name = "content_type")
    String contentType; // "video", "document", etc.

    @Column(name = "content_url")
    String contentUrl;

    @Column(name = "description")
    String description; // Mô tả nội dung nếu cần
}
