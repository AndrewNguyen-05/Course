package com.spring.dlearning.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "lessons")
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Lesson extends AbstractEntity<Long> {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    Course course;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @Builder.Default
    Set<LessonContent> lessonContents = new HashSet<>();

    @Column(name = "title", nullable = false)
    String lessonName;

    @Column(name = "description", columnDefinition = "MEDIUMTEXT")
    String description;

}
