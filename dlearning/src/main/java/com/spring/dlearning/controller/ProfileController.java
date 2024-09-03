package com.spring.dlearning.controller;


import com.spring.dlearning.dto.request.UserProfileRequest;
import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.UserProfileResponse;
import com.spring.dlearning.service.ProfileService;
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
public class ProfileController {

    ProfileService profileService;

    @PutMapping("/update-profile")
    public ApiResponse<Void> updateProfile( @RequestBody UserProfileRequest request){
        profileService.updateProfile(request);

        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Profile updated successfully")
                .build();
    }

    @GetMapping("/info-user")
    public ApiResponse<UserProfileResponse> getUserProfile(){
        var result = profileService.getInfoProfile();

        return ApiResponse.<UserProfileResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Profile info successfully")
                .result(result)
                .build();
    }

}
