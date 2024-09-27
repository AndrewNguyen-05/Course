package com.spring.dlearning.entity;

import com.spring.dlearning.utils.AdsStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "advertisements")
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Advertisement extends AbstractEntity<Long>{

    @Column(name = "title", nullable = false, length = 100)
    String title;

    @Column(name = "description", columnDefinition = "MEDIUMTEXT")
    String description;

    @Email
    @NotNull
    @Column(name = "contact_email", nullable = false)
    String contactEmail;

    @Column(name = "contact_phone", nullable = false)
    String contactPhone;

    @Column(name = "price")
    @Min(value = 0)
    BigDecimal price;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    Course course;

    @Column(name = "image_ads")
    String image;

    @Column(name = "link")
    String link;

    @Column(name = "start_date")
    LocalDate startDate;

    @Column(name = "end_date")
    LocalDate endDate;

    @Enumerated(EnumType.STRING)
    AdsStatus approvalStatus;

}
