package com.spring.dlearning.repository.specification;

import com.spring.dlearning.entity.Course;
import org.springframework.data.jpa.domain.Specification;

public class CourseSpec {

    public static Specification<Course> hasFirstName (String title) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get("title"), "%" + title + "%");
    }

    public static Specification<Course> hasGender (Long point) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("price"), point);
    }
}
