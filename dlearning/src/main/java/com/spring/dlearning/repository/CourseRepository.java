package com.spring.dlearning.repository;

import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.User;
import feign.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long>, JpaSpecificationExecutor<Course>, CustomCourseRepository  {

    List<Course> findByAuthor(User user);

    @Query("SELECT c.title FROM Course c WHERE c.title LIKE %:query%")
    List<String> findTitleSuggestions(String query);

    Page<Course> findByEnabled(boolean enabled, Pageable pageable); // Lọc khóa học theo trạng thái enabled

    @Query("SELECT c FROM Course c LEFT JOIN FETCH c.author WHERE c.id = :id")
    Optional<Course> findCourseDetailsById(@Param("id") Long id);
}
