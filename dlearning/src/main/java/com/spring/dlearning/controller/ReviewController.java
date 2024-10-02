package com.spring.dlearning.controller;

import com.spring.dlearning.dto.request.CommentRequest;
import com.spring.dlearning.dto.request.UpdateCommentRequest;
import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.CommentResponse;
import com.spring.dlearning.dto.response.DeleteCommentResponse;
import com.spring.dlearning.dto.response.UpdateCommentResponse;
import com.spring.dlearning.service.ReviewService;
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
public class ReviewController {

    ReviewService reviewService;

    @GetMapping("/courses-comment/{courseId}")
    ApiResponse<List<CommentResponse>> getReviewByCourseId(@PathVariable Long courseId){
        return ApiResponse.<List<CommentResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(reviewService.getReviewByCourse(courseId))
                .build();
    }

    @PostMapping("/add-comment")
    ApiResponse<CommentResponse> addReview(@RequestBody @Valid CommentRequest commentRequest, @RequestParam Long id){
        return ApiResponse.<CommentResponse>builder()
                .code(HttpStatus.CREATED.value())
                .result(reviewService.addReview(commentRequest, id))
                .build();
    }

    @DeleteMapping("/delete-comment/{id}")
    ApiResponse<DeleteCommentResponse> deleteReview(@PathVariable Long id) {
        return ApiResponse.<DeleteCommentResponse>builder()
                .code(HttpStatus.OK.value())
                .result(reviewService.deleteReviewById(id))
                .build();
    }

    @PutMapping("/update-comment/{id}")
    ApiResponse<UpdateCommentResponse> updateReview(@PathVariable Long id, @RequestBody UpdateCommentRequest request) {
        return ApiResponse.<UpdateCommentResponse>builder()
                .code(HttpStatus.OK.value())
                .result(reviewService.updateReview(id, request))
                .build();
    }

}
