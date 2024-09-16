package com.spring.dlearning.controller;

import com.spring.dlearning.dto.request.ChangePasswordRequest;
import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.ChangePasswordResponse;
import com.spring.dlearning.service.ChangePasswordService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1")
@Slf4j
public class ChangePasswordController {

    ChangePasswordService changePasswordService;

    @PutMapping("/change-password")
    ApiResponse<ChangePasswordResponse> changePassword(@RequestBody @Valid ChangePasswordRequest request){
        return ApiResponse.<ChangePasswordResponse>builder()
                .code(HttpStatus.OK.value())
                .result(changePasswordService.changePassword(request))
                .build();
    }
    
}
