package com.spring.dlearning.controller;

import com.spring.dlearning.dto.request.CommentRequest;
import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.CommentResponse;
import com.spring.dlearning.dto.response.PageResponse;
import com.spring.dlearning.service.CommentService;
import jakarta.validation.Valid;
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
public class CommentController {

    CommentService commentService;

    @GetMapping("/post-comment/{postId}")
    ApiResponse<PageResponse<CommentResponse>> findAll(
            @PathVariable Long postId,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "3") int size) {

        return ApiResponse.<PageResponse<CommentResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(commentService.getCommentByPostId(postId, page, size))
                .build();
    }

    @PostMapping("/add-comment")
    ApiResponse<CommentResponse> addComment (@RequestBody @Valid CommentRequest request){
        return ApiResponse.<CommentResponse>builder()
                .code(HttpStatus.OK.value())
                .result(commentService.addComment(request))
                .build();
    }
}
