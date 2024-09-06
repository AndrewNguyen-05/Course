package com.spring.dlearning.service;

import com.spring.dlearning.dto.response.CourseResponse;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.CourseMapper;
import com.spring.dlearning.repository.CourseRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CourseService {

    CourseRepository courseRepository;
    CourseMapper courseMapper;

    public List<CourseResponse> getAllCourse(){
        return courseRepository.findAll()
                .stream()
                .map(courseMapper::toCourseResponse)
                .toList();
    }

    public CourseResponse getCourseById(Long id){
        return courseRepository.findById(id).map(courseMapper::toCourseResponse)
                .orElseThrow(() -> new AppException(ErrorCode.COURSER_NOT_EXISTED));
    }

}
