package com.spring.dlearning.repository;

import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.Lesson;
import com.spring.dlearning.entity.LessonProgress;
import com.spring.dlearning.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {

    @Query("SELECT COUNT(lp) FROM LessonProgress lp WHERE lp.user = :user AND lp.lesson.chapter.course = :course AND lp.completed = :completed")
    long countByUserAndCourseAndCompleted(@Param("user") User user, @Param("course") Course course, @Param("completed") Boolean completed);

    LessonProgress findByUserAndLesson(User user, Lesson lesson);
}
