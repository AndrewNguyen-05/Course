package com.spring.dlearning.controller;

import com.spring.dlearning.dto.request.ReviewRequest;
import com.spring.dlearning.dto.request.UpdateReviewRequest;
import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.ReviewResponse;
import com.spring.dlearning.dto.response.DeleteCommentResponse;
import com.spring.dlearning.dto.response.UpdateReviewResponse;
import com.spring.dlearning.service.ReviewService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
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
public class ReviewController {

    ReviewService reviewService;

    @GetMapping("/courses-review/{courseId}")
    ApiResponse<List<ReviewResponse>> getReviewByCourseId(@PathVariable @Min(1) Long courseId){
        return ApiResponse.<List<ReviewResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(reviewService.getReviewByCourse(courseId))
                .build();
    }

    @PostMapping("/add-review")
    ApiResponse<ReviewResponse> addReview(@RequestBody @Valid ReviewRequest reviewRequest, @RequestParam Long id){
        return ApiResponse.<ReviewResponse>builder()
                .code(HttpStatus.CREATED.value())
                .result(reviewService.addReview(reviewRequest, id))
                .build();
    }

    @DeleteMapping("/delete-review/{id}")
    ApiResponse<DeleteCommentResponse> deleteReview(@PathVariable @Min(1) Long id) {
        return ApiResponse.<DeleteCommentResponse>builder()
                .code(HttpStatus.OK.value())
                .result(reviewService.deleteReviewById(id))
                .build();
    }

    @PutMapping("/update-review/{id}")
    ApiResponse<UpdateReviewResponse> updateReview(@PathVariable @Min(1) Long id, @RequestBody UpdateReviewRequest request) {
        return ApiResponse.<UpdateReviewResponse>builder()
                .code(HttpStatus.OK.value())
                .result(reviewService.updateReview(id, request))
                .build();
    }

}
