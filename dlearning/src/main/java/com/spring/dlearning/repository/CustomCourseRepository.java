package com.spring.dlearning.repository;


import com.spring.dlearning.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomCourseRepository {
    Page<Course> searchByMultipleKeywords(String[] keywords, Pageable pageable);
}