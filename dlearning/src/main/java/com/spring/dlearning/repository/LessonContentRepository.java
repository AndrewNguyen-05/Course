package com.spring.dlearning.repository;

import com.spring.dlearning.entity.LessonContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonContentRepository extends JpaRepository<LessonContent, Long> {

}
