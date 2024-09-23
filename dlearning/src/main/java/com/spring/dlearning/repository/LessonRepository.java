package com.spring.dlearning.repository;

import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    Optional<Lesson> findByLessonNameAndCourse(String lessonName, Course course);
}
