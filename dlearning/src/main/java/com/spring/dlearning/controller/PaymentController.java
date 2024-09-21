package com.spring.dlearning.controller;

import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.VNPAYResponse;
import com.spring.dlearning.entity.Payment;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.repository.PaymentRepository;
import com.spring.dlearning.repository.UserRepository;
import com.spring.dlearning.service.PaymentService;
import com.spring.dlearning.utils.PaymentStatus;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
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
    public void handleVnPayCallback(HttpServletRequest request, HttpServletResponse response) throws IOException {

        String redirectUrl;

        String transactionStatus = request.getParameter("vnp_ResponseCode");

        BigDecimal amountInVNPay = new BigDecimal(request.getParameter("vnp_Amount"));
        BigDecimal actualAmount = amountInVNPay.divide(new BigDecimal(100));

        String orderInfo = request.getParameter("vnp_OrderInfo");
        String email = orderInfo.replace("Thanh toan don hang cho email: ", "").trim();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if ("00".equals(transactionStatus)) {
            recordPaymentTransaction(user, actualAmount, PaymentStatus.COMPLETED);

            BigDecimal pointsPer1000VND = new BigDecimal(10); // 1000VND = 10 points
            BigDecimal numberOfThousands = actualAmount.divide(new BigDecimal(1000)); //
            BigDecimal totalPoints = numberOfThousands.multiply(pointsPer1000VND);

            long pointsToAdd = totalPoints.longValue();

            if (user.getPoints() == null) {
                user.setPoints(pointsToAdd);
            } else {
                user.setPoints(user.getPoints() + pointsToAdd);
            }
            userRepository.save(user);
            redirectUrl = "http://localhost:3000/payment-success";

        } else if ("24".equals(transactionStatus)) {

            recordPaymentTransaction(user, actualAmount, PaymentStatus.CANCELED);
            redirectUrl = "http://localhost:3000/payment-cancel";

        } else {
            recordPaymentTransaction(user, actualAmount, PaymentStatus.FAILED);
            redirectUrl = "http://localhost:3000/payment-failed";
        }
        response.sendRedirect(redirectUrl);
    }

    private void recordPaymentTransaction(User user, BigDecimal amount, PaymentStatus status) {
        Payment payment = Payment.builder()
                .user(user)
                .price(amount)
                .status(status)
                .build();

        paymentRepository.save(payment);
    }
}
