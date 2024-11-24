package com.spring.dlearning.controller;

import com.spring.dlearning.constant.PaymentType;
import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.VNPAYResponse;
import com.spring.dlearning.entity.Advertisement;
import com.spring.dlearning.entity.Payment;
import com.spring.dlearning.entity.PaymentMethod;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.repository.AdvertisementRepository;
import com.spring.dlearning.repository.PaymentMethodRepository;
import com.spring.dlearning.repository.PaymentRepository;
import com.spring.dlearning.repository.UserRepository;
import com.spring.dlearning.service.PaymentService;
import com.spring.dlearning.utils.AdsStatus;
import com.spring.dlearning.utils.PaymentMethodName;
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

import static com.spring.dlearning.constant.PaymentType.DEPOSIT;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentController {

    PaymentService paymentService;
    PaymentRepository paymentRepository;
    UserRepository userRepository;
    AdvertisementRepository advertisementRepository;
    PaymentMethodRepository paymentMethodRepository;

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

        if ("00".equals(transactionStatus)) {
            String paymentRef = request.getParameter("vnp_TxnRef");
            String[] refParts = paymentRef.split("_");
            PaymentType paymentType = PaymentType.valueOf(refParts[0]);

            switch (paymentType) {
                case DEPOSIT: {
                    User user = userRepository.findById(Long.parseLong(refParts[1]))
                            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

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
                        break;
                }
                case ADVERTISEMENT: {
                    Advertisement advertisement = advertisementRepository.findById(Long.parseLong(refParts[1]))
                            .orElseThrow(() -> new AppException(ErrorCode.ADVERTISEMENT_ID_INVALID));
                    if (actualAmount.compareTo(advertisement.getPrice()) >= 0) {
                        advertisement.setApprovalStatus(AdsStatus.ACTIVE);
                    }
                    advertisementRepository.save(advertisement);
                    break;
                }
                default:
                    throw new AppException(ErrorCode.INVALID_PAYMENT_TYPE);
            }

            redirectUrl = "http://localhost:3000/payment-success";
        } else if ("24".equals(transactionStatus)) {
            redirectUrl = "http://localhost:3000/payment-cancel";
        } else {
            redirectUrl = "http://localhost:3000/payment-failed";
        }
        response.sendRedirect(redirectUrl);
    }

    private void recordPaymentTransaction(User user, BigDecimal amount, PaymentStatus status) {

        PaymentMethod paymentMethod = paymentMethodRepository.findByMethodName(PaymentMethodName.BANK_TRANSFER)
                .orElseGet(() -> paymentMethodRepository.save(
                        PaymentMethod.builder()
                                .methodName(PaymentMethodName.BANK_TRANSFER)
                                .build()
                ));

        Payment payment = Payment.builder()
                .user(user)
                .price(amount)
                .paymentMethod(paymentMethod)
                .status(status)
                .build();

        paymentRepository.save(payment);
    }

}
