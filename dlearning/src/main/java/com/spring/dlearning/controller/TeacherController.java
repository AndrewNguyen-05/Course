package com.spring.dlearning.controller;

import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.InfoTeacherByCourseResponse;
import com.spring.dlearning.dto.response.PageResponse;
import com.spring.dlearning.dto.response.StudentResponse;
import com.spring.dlearning.service.TeacherService;
import jakarta.validation.constraints.Min;
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
public class TeacherController {

    TeacherService teacherService;

    @GetMapping("/info-teacher/{courseId}")
    ApiResponse<InfoTeacherByCourseResponse> getInfoTeacherByCourse(@PathVariable @Min(1) Long courseId){
        return ApiResponse.<InfoTeacherByCourseResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Get information teacher successfully")
                .result(teacherService.infoTeacherByCourseId(courseId))
                .build();
    }

    @GetMapping("/info-student")
    ApiResponse<PageResponse<StudentResponse>> getStudentsByPurchasedCourses(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size
    ){
        return ApiResponse.<PageResponse<StudentResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(teacherService.getStudentsByPurchasedCourses(page, size))
                .build();
    }
}
