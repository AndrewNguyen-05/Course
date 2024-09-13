package com.spring.dlearning.repository;

import com.spring.dlearning.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c WHERE c.course.id = :courseId")
    List<Comment> findByCourseId(Long courseId);
}
