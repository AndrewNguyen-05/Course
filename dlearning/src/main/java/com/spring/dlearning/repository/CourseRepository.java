package com.spring.dlearning.repository;

import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long>, JpaSpecificationExecutor<Course> {

    List<Course> findByAuthor(User user);

    @Query("SELECT c.title FROM Course c WHERE c.title LIKE %:query%")
    List<String> findTitleSuggestions(String query);

}
