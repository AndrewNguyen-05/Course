package com.spring.dlearning.service;

import com.spring.dlearning.configuration.VNPAYConfiguration;
import com.spring.dlearning.dto.response.VNPAYResponse;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.utils.SecurityUtils;
import com.spring.dlearning.utils.VNPayUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentService {

    VNPAYConfiguration vnPayConfig;

    public VNPAYResponse createVnPayPayment(HttpServletRequest request) {
        BigDecimal amount = new BigDecimal(request.getParameter("amount"));
        long amountInLong = amount.multiply(new BigDecimal(100)).longValue();
        String bankCode = request.getParameter("bankCode");

        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        Map<String, String> vnpParamsMap = vnPayConfig.getVNPayConfig();
        vnpParamsMap.put("vnp_Amount", String.valueOf(amountInLong));
        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParamsMap.put("vnp_BankCode", bankCode);
        }
        vnpParamsMap.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));

        vnpParamsMap.put("vnp_OrderInfo", "Thanh toan don hang cho email: " + email);

        String queryUrl = VNPayUtil.getPaymentURL(vnpParamsMap, true);
        String hashData = VNPayUtil.getPaymentURL(vnpParamsMap, false);
        String vnpSecureHash = VNPayUtil.hmacSHA512(vnPayConfig.getSecretKey(), hashData);
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = vnPayConfig.getVnp_PayUrl() + "?" + queryUrl;

        return VNPAYResponse.builder()
                .code("ok")
                .message("success")
                .paymentUrl(paymentUrl)
                .build();
    }
}
