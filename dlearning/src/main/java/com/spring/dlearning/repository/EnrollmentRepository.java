package com.spring.dlearning.repository;

import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.Enrollment;
import com.spring.dlearning.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long>{

    boolean existsByUserAndCourse(User user, Course course);
    List<Enrollment> findCourseByUser(User user);
}
