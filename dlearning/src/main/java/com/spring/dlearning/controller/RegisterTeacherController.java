package com.spring.dlearning.controller;


import com.spring.dlearning.dto.request.UserRegisterTeacherRequest;
import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.UserRegisterTeacherResponse;
import com.spring.dlearning.service.RegisterTeacherService;
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
public class RegisterTeacherController {

    RegisterTeacherService registerTeacherService;

    @PostMapping("/register-teacher")
    ApiResponse<UserRegisterTeacherResponse> registerTeacher (@RequestBody UserRegisterTeacherRequest request) {
        var result = registerTeacherService.registerTeacher(request);

        return ApiResponse.<UserRegisterTeacherResponse>builder()
                .code(HttpStatus.CREATED.value())
                .result(result)
                .build();
    }
}
