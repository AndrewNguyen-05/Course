package com.spring.dlearning.service;

import com.spring.dlearning.dto.response.InfoTeacherByCourseResponse;
import com.spring.dlearning.entity.Course;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.InfoTeacherMapper;
import com.spring.dlearning.repository.CourseRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class TeacherService {

    CourseRepository courseRepository;
    InfoTeacherMapper infoTeacherMapper;

    public InfoTeacherByCourseResponse getInfoTeacherByCourse(Long id) {
        Course course = courseRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_EXISTED));
        return infoTeacherMapper.mapToInfoTeacherByCourseResponse(course);
    }
}