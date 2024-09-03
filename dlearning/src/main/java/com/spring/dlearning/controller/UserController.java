package com.spring.dlearning.controller;


import com.spring.dlearning.dto.request.PasswordCreationRequest;
import com.spring.dlearning.dto.request.UserCreationRequest;
import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.UserResponse;
import com.spring.dlearning.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1")
public class UserController {

    UserService userService;

    @PostMapping("/register")
    ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest request){
        var result = userService.createUser(request);

        return ApiResponse.<UserResponse>builder()
                .code(HttpStatus.CREATED.value())
                .result(result)
                .build();
    }

    @PostMapping("/create-password")
    ApiResponse<Void> createPassword(@RequestBody @Valid PasswordCreationRequest request){
        userService.createPassword(request);

        return ApiResponse.<Void>builder()
                .message("Password has ben created, you could use it to log-in")
                .build();
    }

    @GetMapping("/users")
    ApiResponse<List<UserResponse>> getUsers() {
        var result = userService.getAllUsers();

        return ApiResponse.<List<UserResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

    @GetMapping("my-info")
    ApiResponse<UserResponse> getMyInfo(){
        var result = userService.getMyInfo();
        return ApiResponse.<UserResponse>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();

    }
}
