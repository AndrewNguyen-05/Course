package com.spring.dlearning.controller;

import com.spring.dlearning.dto.request.PeriodTypeRequest;
import com.spring.dlearning.dto.request.RevenueRequest;
import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.RevenueDetailResponse;
import com.spring.dlearning.dto.response.RevenueResponse;
import com.spring.dlearning.service.RevenueService;
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
@RequestMapping("/api/v1")
@Slf4j
public class RevenueController {

    RevenueService revenueService;

    @GetMapping("/revenue")
    ApiResponse<RevenueResponse> revenue (@RequestBody RevenueRequest request) {
        return ApiResponse.<RevenueResponse>builder()
                .code(HttpStatus.OK.value())
                .result(revenueService.totalRevenue(request))
                .build();
    }

    @PostMapping("/revenue-detail")
    ApiResponse<List<RevenueDetailResponse>> revenueDetail (@RequestBody PeriodTypeRequest request) {
        log.info("Revenue detail");
        return ApiResponse.<List<RevenueDetailResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(revenueService.totalRevenueDetail(request))
                .build();
    }
}
