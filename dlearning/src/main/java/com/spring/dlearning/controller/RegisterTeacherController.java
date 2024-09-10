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
import org.springframework.web.bind.annotation.*;

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
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

    @PostMapping("/save-teacher/{id}")
    ApiResponse<UserRegisterTeacherResponse> saveTeacher (@PathVariable Long id) {
        var result = registerTeacherService.saveTeacher(id);

        return ApiResponse.<UserRegisterTeacherResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Approve Teacher Successfully")
                .result(result)
                .build();
    }

    @PostMapping("/reject-teacher/{id}")
    ApiResponse<UserRegisterTeacherResponse> rejectTeacher(@PathVariable Long id) {
        var result = registerTeacherService.rejectTeacher(id);

        return ApiResponse.<UserRegisterTeacherResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Reject Successfully")
                .result(result)
                .build();
    }
}
