package com.spring.dlearning.controller;

import com.spring.dlearning.dto.request.PostCreationRequest;
import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.PostCreationResponse;
import com.spring.dlearning.service.PostService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1")
@Slf4j
public class PostController {

    PostService postService;

    @PostMapping("/create-post")
    ApiResponse<PostCreationResponse> createPost (@RequestBody @Valid PostCreationRequest request) {
        return ApiResponse.<PostCreationResponse>builder()
                .code(HttpStatus.CREATED.value())
                .result(postService.createPost(request))
                .build();
    }
}
