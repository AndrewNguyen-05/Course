package com.spring.dlearning.controller;

import com.spring.dlearning.dto.request.CourseRequest;
import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.CourseResponse;
import com.spring.dlearning.dto.response.PageResponse;
import com.spring.dlearning.entity.Course;
import com.spring.dlearning.service.CourseService;
import com.turkraft.springfilter.boot.Filter;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1")
@Slf4j
public class CourseController {

    CourseService courseService;

    @GetMapping("/courses")
    ApiResponse<PageResponse<CourseResponse>> getAllCourses(
            @Filter Specification<Course> spec,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "6") int size) {

        PageResponse<CourseResponse> result = courseService.getAllCourses(spec, page, size);

        return ApiResponse.<PageResponse<CourseResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Get All Courses Successfully")
                .result(result)
                .build();
    }

    @GetMapping("/title")
    public ApiResponse<List<String>> getTitleSuggestions(@RequestParam("query") String query) {
        List<String> suggestions = courseService.getTitleSuggestions(query);
        return ApiResponse.<List<String>>builder()
                .code(HttpStatus.OK.value())
                .message("Suggestions fetched successfully")
                .result(suggestions)
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

    @GetMapping("/my-courses")
    ApiResponse<List<CourseResponse>> myCourses(){
        var result = courseService.myCourses();

        return ApiResponse.<List<CourseResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

}
