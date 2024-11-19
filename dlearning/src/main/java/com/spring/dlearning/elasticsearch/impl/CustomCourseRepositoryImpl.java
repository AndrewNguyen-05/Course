package com.spring.dlearning.elasticsearch.impl;

import com.spring.dlearning.elasticsearch.CourseDocument;
import com.spring.dlearning.elasticsearch.CustomCourseRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class CustomCourseRepositoryImpl implements CustomCourseRepository {

    @Override
    public List<CourseDocument> findByDynamicTitleSearch(String title) {
        return List.of();
    }
}
