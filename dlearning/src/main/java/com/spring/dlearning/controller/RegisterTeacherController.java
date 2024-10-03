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
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1")
@Slf4j
public class RegisterTeacherController {

    RegisterTeacherService registerTeacherService;

    @GetMapping("/registration-teachers")
    ApiResponse<List<UserRegisterTeacherResponse>> getAll(){
        return ApiResponse.<List<UserRegisterTeacherResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(registerTeacherService.getAll())
                .build();
    }

    @PostMapping("/register-teacher")
    ApiResponse<UserRegisterTeacherResponse> registerTeacher(
            @RequestPart("request") UserRegisterTeacherRequest request,
            @RequestPart("cv") MultipartFile cv,
            @RequestPart("certificate") MultipartFile certificate
    ) throws IOException, URISyntaxException {

        var result = registerTeacherService.registerTeacher(request, cv, certificate);

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