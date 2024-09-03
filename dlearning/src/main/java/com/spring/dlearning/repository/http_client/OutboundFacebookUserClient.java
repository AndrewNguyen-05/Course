package com.spring.dlearning.repository.http_client;

import com.spring.dlearning.dto.response.OutboundFacebookResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "outbound-facebook-user-client", url = "https://graph.facebook.com")
public interface OutboundFacebookUserClient {

    @GetMapping(value = "/me")
    OutboundFacebookResponse getUserInfo(@RequestParam("fields") String fields,
                                         @RequestParam("access_token") String accessToken);
}
