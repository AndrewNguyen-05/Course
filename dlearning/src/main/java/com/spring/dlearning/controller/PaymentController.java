package com.spring.dlearning.controller;

import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.VNPAYResponse;
import com.spring.dlearning.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentController {

    PaymentService paymentService;

    @GetMapping("/vn-pay")
    public ApiResponse<VNPAYResponse> pay(HttpServletRequest request) {
        return ApiResponse.<VNPAYResponse>builder()
                .code(HttpStatus.OK.value())
                .message("OK")
                .result(paymentService.createVnPayPayment(request))
                .build();
    }
    @GetMapping("/vn-pay-callback")
    public ApiResponse<VNPAYResponse> payCallbackHandler(HttpServletRequest request) {
        String status = request.getParameter("vnp_ResponseCode");
        if (status.equals("00")) {
            return ApiResponse.<VNPAYResponse>builder()
                    .code(HttpStatus.OK.value())
                    .message("Successfully")
                    .build();
        } else {
            return ApiResponse.<VNPAYResponse>builder()
                    .code(HttpStatus.CONFLICT.value())
                    .message("Failed")
                    .build();
        }
    }
}
