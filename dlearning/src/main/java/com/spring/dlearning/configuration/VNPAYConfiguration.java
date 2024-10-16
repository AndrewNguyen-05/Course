package com.spring.dlearning.configuration;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import java.util.*;

@Configuration
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VNPAYConfiguration {

    @Getter
    @Value("${payment.vnPay.url}")
    String vnp_PayUrl;

    @Value("${payment.vnPay.returnUrl}")
    String vnp_ReturnUrl;

    @Value("${payment.vnPay.tmnCode}")
    String vnp_TmnCode;

    @Getter
    @Value("${payment.vnPay.secretKey}")
    String secretKey;

    @Value("${payment.vnPay.version}")
    String vnp_Version;

    @Value("${payment.vnPay.command}")
    String vnp_Command;

    @Value("${payment.vnPay.orderType}")
    String orderType;

    public Map<String, String> getVNPayConfig() {
        Map<String, String> vnpParamsMap = new HashMap<>();
        vnpParamsMap.put("vnp_Version", this.vnp_Version);
        vnpParamsMap.put("vnp_Command", this.vnp_Command);
        vnpParamsMap.put("vnp_TmnCode", this.vnp_TmnCode);
        vnpParamsMap.put("vnp_CurrCode", "VND");
        vnpParamsMap.put("vnp_OrderType", this.orderType);
        vnpParamsMap.put("vnp_Locale", "vn");
        vnpParamsMap.put("vnp_ReturnUrl", this.vnp_ReturnUrl);
        return vnpParamsMap;
    }

}
