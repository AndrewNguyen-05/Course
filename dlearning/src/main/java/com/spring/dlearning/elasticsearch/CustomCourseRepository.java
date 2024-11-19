package com.spring.dlearning.elasticsearch;

import java.util.List;

public interface CustomCourseRepository {
    List<CourseDocument> findByDynamicTitleSearch(String title);
}
