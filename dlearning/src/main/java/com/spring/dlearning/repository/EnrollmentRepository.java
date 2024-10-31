package com.spring.dlearning.repository;

import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.Enrollment;
import com.spring.dlearning.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long>{

    boolean existsByUserAndCourse(User user, Course course);
    List<Enrollment> findCourseByUser(User user);

    @Query("SELECT e FROM Enrollment e WHERE e.user = :user AND e.course = :course")
    Optional<Enrollment> checkPurchase(User user, Course course);

    @Query("SELECT COUNT(DISTINCT e.user.id) FROM Enrollment e WHERE e.course.author.id = :teacherId")
    int totalStudentsByTeacher(Long teacherId);

}
