package com.spring.dlearning.controller;

import com.spring.dlearning.dto.request.CommentRequest;
import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.CommentResponse;
import com.spring.dlearning.service.CommentService;
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
public class CommentController {

    CommentService commentService;

    @GetMapping("/courses-comment/{courseId}")
    ApiResponse<List<CommentResponse>> getCommentByCourseId(@PathVariable Long courseId){
        return ApiResponse.<List<CommentResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(commentService.getCommentByCourse(courseId))
                .build();
    }

    @PostMapping("/add-comment")
    ApiResponse<CommentResponse> addComment(@RequestBody CommentRequest commentRequest, @RequestParam Long id){
        System.out.println("Parent Comment ID: " + commentRequest.getParentCommentId());
        System.out.println("Content: " + commentRequest.getContent());
        return ApiResponse.<CommentResponse>builder()
                .code(HttpStatus.CREATED.value())
                .result(commentService.addComment(commentRequest, id))
                .build();
    }

}
