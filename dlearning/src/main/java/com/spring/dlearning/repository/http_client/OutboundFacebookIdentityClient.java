package com.spring.dlearning.repository.http_client;

import com.spring.dlearning.dto.request.ExchangeTokenRequest;
import com.spring.dlearning.dto.response.ExchangeTokenResponse;
import feign.QueryMap;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "outbound-facebook-identity", url = "https://graph.facebook.com")
public interface OutboundFacebookIdentityClient {

    @PostMapping(value = "/v10.0/oauth/access_token", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    ExchangeTokenResponse exchangeToken(@QueryMap ExchangeTokenRequest request);
}
