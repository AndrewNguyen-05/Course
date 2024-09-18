package com.spring.dlearning.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Table(name = "certificates")
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Certificate extends AbstractEntity<Long> {

    @Column(name = "name", nullable = false)
    String name;

    @Column(name = "issue_date")
    LocalDate issueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    User user; // Liên kết với User để lấy thông tin người nhận chứng chỉ

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    Course course; // Liên kết với Course để lấy thông tin về khóa học

    @Column(name = "certificate_url")
    String certificateUrl;

    @Column(name = "description")
    String description;


}
