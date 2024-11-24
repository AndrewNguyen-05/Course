package com.spring.dlearning.controller;

import com.spring.dlearning.dto.request.LessonProgressRequest;
import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.LessonProgressResponse;
import com.spring.dlearning.dto.response.UserCompletionResponse;
import com.spring.dlearning.service.LessonProgressService;
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
public class LessonProgressController {

    LessonProgressService lessonProgressService;

    @GetMapping("/calculate-completion/{courseId}")
    ApiResponse<UserCompletionResponse> calculateCompletion (@PathVariable Long courseId) {

        return ApiResponse.<UserCompletionResponse>builder()
                .code(HttpStatus.OK.value())
                .result(lessonProgressService.calculateCompletion(courseId))
                .build();
    }

    @PostMapping("/update-lesson-progress")
    ApiResponse<LessonProgressResponse> markLessonAsCompleted(@RequestBody LessonProgressRequest request) {
        return ApiResponse.<LessonProgressResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Update successfully")
                .result(lessonProgressService.markLessonAsCompleted(request))
                .build();
    }
}
