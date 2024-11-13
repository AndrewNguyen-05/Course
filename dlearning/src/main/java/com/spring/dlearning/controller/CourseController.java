package com.spring.dlearning.controller;

import com.spring.dlearning.dto.request.BuyCourseRequest;
import com.spring.dlearning.dto.request.CourseCreationRequest;
import com.spring.dlearning.dto.request.UploadCourseRequest;
import com.spring.dlearning.dto.response.*;
import com.spring.dlearning.entity.Course;
import com.spring.dlearning.service.CourseService;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
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

    @GetMapping("/course/{id}")
    ApiResponse<CourseResponse> getCourseById(@PathVariable @Min(1) Long id){
        var result = courseService.getCourseById(id);

        return ApiResponse.<CourseResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Get Course Successfully")
                .result(result)
                .build();
    }

    @PostMapping(value = "/create-course", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<CourseCreationResponse> createCourse(
            @RequestPart("courseRequest") CourseCreationRequest courseRequest,
            @RequestPart("thumbnail") MultipartFile thumbnail,
            @RequestPart("video") MultipartFile video) throws IOException {

        var result = courseService.createCourse(courseRequest, thumbnail, video);

        return ApiResponse.<CourseCreationResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Create Course Successfully")
                .result(result)
                .build();
    }

    @GetMapping("/manager-courses")
    ApiResponse<List<CourseResponse>> managerCourse(){
        var result = courseService.managerCourses();

        return ApiResponse.<List<CourseResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

    @PostMapping("/upload-course")
    ApiResponse<UploadCourseResponse> uploadCourse(
            @RequestPart("course") @Valid UploadCourseRequest request,
            @RequestPart("file") MultipartFile courseFile,
            @RequestPart("thumbnail") MultipartFile thumbnail) throws IOException {

        return ApiResponse.<UploadCourseResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Upload Course Successfully")
                .result(courseService.uploadCourse(request, courseFile, thumbnail))
                .build();
    }

    @GetMapping("/info-course/{id}")
    ApiResponse<CourseChapterResponse> infoCourse(@PathVariable @Min(1) Long id){
        return ApiResponse.<CourseChapterResponse>builder()
                .code(HttpStatus.OK.value())
                .result(courseService.getAllInfoCourse(id))
                .build();
    }

    @DeleteMapping("/delete-courses/{courseId}")
    ApiResponse<Void> deleteCourse (@PathVariable Long courseId) {
        courseService.deleteCourse(courseId);

        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Delete Course Successfully")
                .build();
    }

    @PostMapping("/buy-course")
    ApiResponse<BuyCourseResponse> buyCourse(@RequestBody @Valid BuyCourseRequest request) {
        return ApiResponse.<BuyCourseResponse>builder()
                .code(HttpStatus.OK.value())
                .result(courseService.buyCourse(request))
                .build();
    }

}
