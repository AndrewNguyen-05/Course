package com.spring.dlearning.controller;

import com.spring.dlearning.dto.request.CourseRequest;
import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.CourseResponse;
import com.spring.dlearning.dto.response.PageResponse;
import com.spring.dlearning.service.CourseService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1")
@Slf4j
public class CourseController {

    CourseService courseService;

    @GetMapping("/courses")
    ApiResponse<PageResponse<CourseResponse>> getAllCourse(@RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                                           @RequestParam(value = "size", required = false, defaultValue = "4") int size) {
        // page: currentPage, size: tổng element của currentPage
        var result = courseService.getAllCourse(page, size);

        return ApiResponse.<PageResponse<CourseResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Get ALl Course Successfully")
                .result(result)
                .build();
    }

    @GetMapping("/course/{id}")
    ApiResponse<CourseResponse> getCourseById(@PathVariable Long id){
        var result = courseService.getCourseById(id);

        return ApiResponse.<CourseResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Get Course Successfully")
                .result(result)
                .build();
    }

    @PostMapping("/create-course")
    ApiResponse<CourseResponse> createCourse(@RequestBody CourseRequest courseRequest){
        var result = courseService.createCourse(courseRequest);

        return ApiResponse.<CourseResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Create Course Successfully")
                .result(result)
                .build();
    }
}
