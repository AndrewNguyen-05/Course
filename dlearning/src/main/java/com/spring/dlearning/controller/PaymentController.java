package com.spring.dlearning.controller;

import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.VNPAYResponse;
import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.Enrollment;
import com.spring.dlearning.entity.Payment;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.repository.EnrollmentRepository;
import com.spring.dlearning.repository.PaymentRepository;
import com.spring.dlearning.repository.UserRepository;
import com.spring.dlearning.service.PaymentService;
import com.spring.dlearning.utils.PaymentStatus;
import com.spring.dlearning.utils.SecurityUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentController {

    PaymentService paymentService;
    PaymentRepository paymentRepository;
    UserRepository userRepository;

    @GetMapping("/vn-pay")
    public ApiResponse<VNPAYResponse> pay(HttpServletRequest request) {
        return ApiResponse.<VNPAYResponse>builder()
                .code(HttpStatus.OK.value())
                .message("OK")
                .result(paymentService.createVnPayPayment(request))
                .build();
    }

    @GetMapping("/vn-pay-callback")
    public ApiResponse<String> handleVnPayCallback(HttpServletRequest request) {

        String transactionStatus = request.getParameter("vnp_ResponseCode");
        BigDecimal amount = new BigDecimal(request.getParameter("vnp_Amount"));

        String orderInfo = request.getParameter("vnp_OrderInfo");
        String email = orderInfo.replace("Thanh toan don hang cho email: ", "").trim();

        if ("00".equals(transactionStatus)) {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            Payment payment = Payment.builder()
                    .user(user)
                    .price(amount)
                    .status(PaymentStatus.COMPLETED)
                    .build();

            paymentRepository.save(payment);

            return ApiResponse.<String>builder()
                    .code(HttpStatus.OK.value())
                    .message("Payment and enrollment successful")
                    .build();
        } else {
            return ApiResponse.<String>builder()
                    .code(HttpStatus.PAYMENT_REQUIRED.value())
                    .message("Payment failed")
                    .build();
        }
    }


}
