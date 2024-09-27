package com.spring.dlearning.controller;

import com.spring.dlearning.dto.request.AdsCreationRequest;
import com.spring.dlearning.dto.response.AdsCreationResponse;
import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.service.AdvertisementService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.net.URISyntaxException;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1")
@Slf4j
public class AdvertisementController {

    AdvertisementService advertisementService;

    @PostMapping("/register-ads")
    ApiResponse<AdsCreationResponse> userCreateAds(@RequestPart("request") @Valid AdsCreationRequest request,
                                                   @RequestPart("file") MultipartFile file)
            throws URISyntaxException, IOException {

        var result  = advertisementService.userCreateAds(request, file);

        return ApiResponse.<AdsCreationResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Your request has been sent, please wait for our response.")
                .result(result)
                .build();
    }

}
