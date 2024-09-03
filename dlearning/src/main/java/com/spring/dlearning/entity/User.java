package com.spring.dlearning.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.spring.dlearning.utils.CourseLevel;
import com.spring.dlearning.utils.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import jakarta.persistence.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Collections;
import java.util.Set;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "users")
public class User extends AbstractEntity<Long>{

    @Column(name = "email", nullable = false, unique = true)
    @NotNull
    @Email
    String email;

    @Column(name = "password")
    String password;

    @Column(name = "name", nullable = false)
    String name;

    @Column(name = "avatar")
    String avatar;

    @Column(name = "first_name", nullable = false)
    String firstName;

    @Column(name = "last_name", nullable = false)
    String lastName;

    @Column(name = "dob")
    @DateTimeFormat(pattern = "yyyy/MM/dd")
    LocalDate dob;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(name = "courseLevel")
    CourseLevel courseLevel;

    @Column(name = "phone")
    String phone;

    @Column(name = "address")
    String address;

    @Column(name = "description")
    String description;

    @Column(name = "zipCode")
    String zipCode;

    @Column(name = "enabled")
    Boolean enabled;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    Role role;

    @JsonManagedReference
    @OneToMany(mappedBy = "author", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    private Set<Course> authoredCourses;

    @OneToMany(mappedBy = "user", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    private Set<Wishlist> wishlists;

    @PrePersist
    protected void onCreate() {
        if (enabled == null) {
            enabled = true;
        }
    }
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(role.getName()));
    }

}
