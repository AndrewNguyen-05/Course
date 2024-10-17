package com.spring.dlearning.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.exception.ExpiredTokenException;
import jakarta.annotation.Nonnull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class CustomJwtAuthFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(@Nonnull  HttpServletRequest request,
                                    @Nonnull HttpServletResponse response,
                                    @Nonnull FilterChain filterChain)
            throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        }catch (ExpiredTokenException exception) {
            ErrorCode errorCode = exception.getErrorCode();
            ApiResponse<Object> apiResponse = ApiResponse.builder()
                    .code(errorCode.getCode())
                    .message(errorCode.getMessage())
                    .build();

            response.setStatus(errorCode.getStatusCode().value());
            response.getWriter().write(new ObjectMapper().writeValueAsString(apiResponse));
        }
    }
}
