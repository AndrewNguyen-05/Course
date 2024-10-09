package com.spring.dlearning.controller;

import com.spring.dlearning.dto.request.AdsApproveRequest;
import com.spring.dlearning.dto.request.AdsCreationRequest;
import com.spring.dlearning.dto.response.AdsApproveResponse;
import com.spring.dlearning.dto.response.AdsCreationResponse;
import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.PageResponse;
import com.spring.dlearning.service.AdvertisementService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.UnsupportedEncodingException;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1")
@Slf4j
public class AdvertisementController {

    AdvertisementService advertisementService;

    @PostMapping("/register-ads")
    ApiResponse<AdsCreationResponse> userCreateAds(@RequestPart("request") @Valid AdsCreationRequest request,
                                                   @RequestPart("file") MultipartFile file) {
        var result  = advertisementService.userCreateAds(request, file);
        return ApiResponse.<AdsCreationResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Your request has been sent, please wait for our response.")
                .result(result)
                .build();
    }

    @PutMapping("/approve-ads")
    ApiResponse<AdsApproveResponse> approveAds(@RequestBody AdsApproveRequest request) {
        return ApiResponse.<AdsApproveResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Your request has been approved, please proceed to payment")
                .result(advertisementService.approveAds(request))
                .build();
    }

    @GetMapping("/get-ads-current")
    ApiResponse<PageResponse<AdsCreationResponse>> getAllByCurrentLogin(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "5") int size)
    {
        return ApiResponse.<PageResponse<AdsCreationResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(advertisementService.getAdsByCurrentLogin(page, size))
                .build();
    }

}
