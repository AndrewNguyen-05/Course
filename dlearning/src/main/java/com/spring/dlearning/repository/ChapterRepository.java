package com.spring.dlearning.repository;

import com.spring.dlearning.entity.Chapter;
import com.spring.dlearning.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    Optional<Chapter> findByChapterNameAndCourse(String chapterName, Course course);
}
