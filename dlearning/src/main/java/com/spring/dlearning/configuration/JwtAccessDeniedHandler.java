package com.spring.dlearning.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import java.io.IOException;

public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException)
            throws IOException {

        ErrorCode errorCode = ErrorCode.ACCESS_DENIED;
        response.setStatus(errorCode.getCode());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ApiResponse<Object> apiResponse = ApiResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();

        ObjectMapper objectMapper = new ObjectMapper();

        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
        response.flushBuffer();

    }
}
