package com.spring.dlearning.controller;

import com.spring.dlearning.dto.request.PeriodTypeRequest;
import com.spring.dlearning.dto.request.RevenueRequest;
import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.RevenueDetailResponse;
import com.spring.dlearning.dto.response.RevenueResponse;
import com.spring.dlearning.dto.response.RevenueSummaryResponse;
import com.spring.dlearning.service.RevenueService;
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
        return ApiResponse.<List<RevenueDetailResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(revenueService.totalRevenueDetail(request))
                .build();
    }

    @PostMapping("/teacher/revenue-detail")
    ApiResponse<RevenueSummaryResponse> revenueDetailTeacher (@RequestBody PeriodTypeRequest request) {
        return ApiResponse.<RevenueSummaryResponse>builder()
                .code(HttpStatus.OK.value())
                .result(revenueService.revenueTeacher(request))
                .build();
    }
}
