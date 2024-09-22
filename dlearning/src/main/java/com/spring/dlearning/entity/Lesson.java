package com.spring.dlearning.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "lessons")
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Lesson extends AbstractEntity<Long> {

    @ManyToOne
    @JoinColumn(name = "course_id")
    Course course;

    @Column(name = "title", nullable = false)
    String lessonName;

    @Column(name = "description", columnDefinition = "MEDIUMTEXT")
    String description;

    @Column(name = "videoUrl")
    String videoUrl;

}
