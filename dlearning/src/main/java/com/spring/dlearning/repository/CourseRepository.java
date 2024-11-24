package com.spring.dlearning.repository;

import com.spring.dlearning.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long>, JpaSpecificationExecutor<Course> {

    @Query("SELECT c FROM Course c JOIN c.author u WHERE u.id = :userId")
    List<Course> findByAuthorId(@Param("userId") Long userId);

    @Query("SELECT count(*) FROM Review r WHERE r.user.id=:userId")
    int totalReview (Long userId);

    @Query(value = "SELECT * FROM courses " +
            "WHERE MATCH(title, description) AGAINST (:keywords IN NATURAL LANGUAGE MODE) " +
            "AND id != :currentCourseId " +
            "ORDER BY MATCH(title, description) AGAINST (:keywords IN NATURAL LANGUAGE MODE) DESC " +
            "LIMIT 5",
            nativeQuery = true)
    List<Course> findRelatedCourses(@Param("keywords") String keywords, @Param("currentCourseId") Long currentCourseId);
}
