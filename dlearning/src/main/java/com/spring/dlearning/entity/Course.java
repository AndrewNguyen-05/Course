package com.spring.dlearning.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.spring.dlearning.utils.CourseLevel;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Entity
@Table(name = "courses")
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "wishlists"})
public class Course extends AbstractEntity<Long>{

    @Column(name = "title", nullable = false)
    String title;

    @Column(columnDefinition = "MEDIUMTEXT")
    String description;

    @Column(name = "price", nullable = false)
    Double price;

    @Column(name = "duration")
    Integer duration; // in hours

    @Column(name = "language", nullable = false)
    String language;

    @Enumerated(EnumType.STRING)
    @Column(name = "level")
    CourseLevel level;

    @Column(name = "thumbnail")
    String thumbnail;

    @Column(name = "video_url")
    String videoUrl;

    @ManyToOne
    @JoinColumn(name = "author_id")
    @JsonBackReference
    User author;

    @OneToMany(mappedBy = "course", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    Set<Wishlist> wishlists;

}
