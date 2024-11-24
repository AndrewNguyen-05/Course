package com.spring.dlearning.controller;

import com.spring.dlearning.dto.event.CertificateCreationEvent;
import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.CertificateResponse;
import com.spring.dlearning.service.CertificateService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1/certificate")
@Slf4j
public class CertificateController {

    CertificateService certificateService;

    @PostMapping("/creation")
    ApiResponse<Void> createCertification (@RequestBody CertificateCreationEvent request) {
        certificateService.createCertificate(request);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Certificate created")
                .build();
    }

    @GetMapping("/current-login")
    ApiResponse<List<CertificateResponse>> getCertificationByUserLogin() {
        return ApiResponse.<List<CertificateResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(certificateService.getCertificationByUserLogin())
                .build();
    }

}
