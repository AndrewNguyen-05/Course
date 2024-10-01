package com.spring.dlearning.controller;

import com.spring.dlearning.dto.request.CreationChapterRequest;
import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.CreationChapterResponse;
import com.spring.dlearning.service.ChapterService;
import jakarta.validation.Valid;
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
public class ChapterController {

    ChapterService chapterService;

    @PostMapping("/upload/chapter")
    ApiResponse<CreationChapterResponse> createLesson(@RequestPart("lesson") @Valid CreationChapterRequest request,
                                                      @RequestPart("file") MultipartFile file) throws IOException {
        return ApiResponse.<CreationChapterResponse>builder()
                .code(HttpStatus.CREATED.value())
                .result(chapterService.createChapter(request, file))
                .build();
    }

}
