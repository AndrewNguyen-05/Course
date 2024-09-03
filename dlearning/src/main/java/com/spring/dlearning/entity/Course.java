package com.spring.dlearning.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
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
public class Course extends AbstractEntity<Long>{

    String title;
    @Column(columnDefinition = "MEDIUMTEXT")
    String description;
    Double price;
    Integer duration; // in hours
    String language;

    @Enumerated(EnumType.STRING)
    CourseLevel level;

    private String thumbnail;
    private String videoUrl;

    @ManyToOne
    @JoinColumn(name = "author_id")
    @JsonBackReference
    private User author;

    @OneToMany(mappedBy = "course", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    Set<Wishlist> wishlists;

}
