package com.spring.dlearning.controller;


import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.JWTClaimsSet;
import com.spring.dlearning.dto.request.AuthenticationRequest;
import com.spring.dlearning.dto.request.IntrospectRequest;
import com.spring.dlearning.dto.request.LogoutRequest;
import com.spring.dlearning.dto.request.RefreshTokenRequest;
import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.AuthenticationResponse;
import com.spring.dlearning.dto.response.IntrospectResponse;
import com.spring.dlearning.dto.response.TokenInfoResponse;
import com.spring.dlearning.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1/auth")
@Slf4j
public class AuthenticationController {

    AuthenticationService authenticationService;

    @PostMapping("/outbound/authentication")
    public ApiResponse<AuthenticationResponse> outboundAuthenticateGoogle(@RequestParam("code") String code) {
        log.info("Received code: {}", code);

        var result = authenticationService.outboundAuthenticate(code);
        log.info("Authentication result: {}", result);

        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }

    @PostMapping("/outbound/authentication-fb")
    public ApiResponse<AuthenticationResponse> outboundAuthenticateFacebook(@RequestParam("code") String code) {
        log.info("Received code LoginFb: {}", code);

        var result = authenticationService.facebookAuthenticate(code);
        log.info("Authentication result Fb: {}", result);

        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }



    @PostMapping("/token")
    public ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        var result = authenticationService.authenticate(request);

        return ApiResponse.<AuthenticationResponse>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

    @PostMapping("/introspect")
    public ApiResponse<?> introspect(@RequestBody IntrospectRequest request)
            throws ParseException, JOSEException {

        var result = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestBody LogoutRequest request)
            throws ParseException, JOSEException {

        authenticationService.logout(request);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Logout Successfully")
                .build();
    }


    @PostMapping("/refresh")
    public ApiResponse<AuthenticationResponse> refreshToken(@RequestBody RefreshTokenRequest request)
            throws ParseException, JOSEException {

        var result = authenticationService.refreshToken(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

}
