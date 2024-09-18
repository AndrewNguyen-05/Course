package com.spring.dlearning.controller;


import com.spring.dlearning.dto.request.PasswordCreationRequest;
import com.spring.dlearning.dto.request.UserCreationRequest;
import com.spring.dlearning.dto.request.VerifyOtpRequest;
import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.UserResponse;
import com.spring.dlearning.dto.response.VerifyOtpResponse;
import com.spring.dlearning.service.CloudinaryService;
import com.spring.dlearning.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1")
public class UserController {

    UserService userService;
    CloudinaryService cloudinaryService;

    @PostMapping("/register")
    public ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest request,
                                                @RequestParam String otp) throws MessagingException {
        var result = userService.createUser(request, otp);

        return ApiResponse.<UserResponse>builder()
                .code(HttpStatus.CREATED.value())
                .result(result)
                .build();
    }

    @PostMapping("/check-exists-user")
    ApiResponse<Boolean> checkExistsUser(@RequestParam String email ){
        var result = userService.findByEmail(email);
        System.out.println(result);

        return ApiResponse.<Boolean>builder()
                .code(HttpStatus.OK.value())
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

    @PostMapping("/send-otp")
    ApiResponse<Void> sendOtp(@RequestParam String email)
            throws MessagingException, UnsupportedEncodingException {

        userService.sendOtp(email);

        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Send Otp Successfully")
                .build();
    }

    @PostMapping("/send-otp-register")
    ApiResponse<Void> sendOtpRegister(@RequestParam String email)
            throws MessagingException, UnsupportedEncodingException {
        userService.sendOtpRegister(email);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Send Otp Successfully")
                .build();
    }

    @PostMapping("/verify-otp")
    public ApiResponse<VerifyOtpResponse> verifyOtp(@RequestBody VerifyOtpRequest request) {
        var result = userService.verifyOtp(request);

        return ApiResponse.<VerifyOtpResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Verify Otp Successfully")
                .result(result)
                .build();
    }


    @PostMapping("/reset-password")
    ApiResponse<?> resetPassword(@RequestBody @Valid PasswordCreationRequest request,
                                 @RequestParam String email,
                                 @RequestParam String otp ){
        userService.resetPassword(email, otp, request);

        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Reset Password Successfully")
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

    @GetMapping("/my-info")
    ApiResponse<UserResponse> getMyInfo(){
        var result = userService.getMyInfo();
        return ApiResponse.<UserResponse>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();

    }

    @GetMapping("/get-avatar")
    ApiResponse<String> getAvatar(){
        String urlAvatar = cloudinaryService.getImage();
        return ApiResponse.<String>builder()
                .code(HttpStatus.OK.value())
                .result(urlAvatar)
                .build();
    }
}
