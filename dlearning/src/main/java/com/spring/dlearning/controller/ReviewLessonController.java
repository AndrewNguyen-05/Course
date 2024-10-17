package com.spring.dlearning.controller;

import com.spring.dlearning.dto.request.ReviewLessonRequest;
import com.spring.dlearning.dto.request.UpdateReviewLessonRequest;
import com.spring.dlearning.dto.response.*;
import com.spring.dlearning.service.ReviewLessonService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1")
@Slf4j
public class ReviewLessonController {

    ReviewLessonService reviewLessonService;

    @GetMapping("/lesson-review/{courseId}&{chapterId}&{lessonId}")
    ApiResponse<List<ReviewLessonResponse>> getReviewByCourse(@PathVariable Long courseId, @PathVariable Long chapterId, @PathVariable Long lessonId){
        return ApiResponse.<List<ReviewLessonResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(reviewLessonService.getReviewLessonByCourse(courseId, chapterId, lessonId))
                .build();
    }

    @PostMapping("/add-lesson-review")
    ApiResponse<ReviewLessonResponse> addReview(@RequestBody @Valid ReviewLessonRequest reviewLessonRequest){
        return ApiResponse.<ReviewLessonResponse>builder()
                .code(HttpStatus.CREATED.value())
                .result(reviewLessonService.addReview(reviewLessonRequest))
                .build();
    }

    @DeleteMapping("/delete-lesson-review/{id}")
    ApiResponse<DeleteCommentResponse> deleteReview(@PathVariable Long id) {
        return ApiResponse.<DeleteCommentResponse>builder()
                .code(HttpStatus.OK.value())
                .result(reviewLessonService.deleteReviewById(id))
                .build();
    }

    @PutMapping("/update-lesson-review/{id}")
    ApiResponse<UpdateReviewResponse> updateReview(@PathVariable Long id, @RequestBody UpdateReviewLessonRequest request) {
        return ApiResponse.<UpdateReviewResponse>builder()
                .code(HttpStatus.OK.value())
                .result(reviewLessonService.updateReview(id, request))
                .build();
    }
}
