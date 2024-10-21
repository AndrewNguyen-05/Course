package com.spring.dlearning.controller;

import com.spring.dlearning.dto.request.LessonCreationRequest;
import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.LessonCreationResponse;
import com.spring.dlearning.service.LessonService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1")
@Slf4j
public class LessonController {

    LessonService lessonService;

    @PostMapping("/create-lesson")
    ApiResponse<LessonCreationResponse> createLesson(@RequestPart("request") LessonCreationRequest request,
                                                     @RequestPart("video") MultipartFile file)
            throws IOException {
        var result = lessonService.createLesson(request, file);

        return ApiResponse.<LessonCreationResponse>builder()
                .code(HttpStatus.CREATED.value())
                .result(result)
                .build();
    }
}
