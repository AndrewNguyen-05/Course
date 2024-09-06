package com.spring.dlearning.controller;


import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.CourseResponse;
import com.spring.dlearning.service.CourseService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1")
@Slf4j
public class CourseController {

    CourseService courseService;

    @GetMapping("/courses")
    ApiResponse<List<CourseResponse>> getAllCourse() {
        var result = courseService.getAllCourse();

        return ApiResponse.<List<CourseResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Get ALl Course Successfully")
                .result(result)
                .build();
    }
}
