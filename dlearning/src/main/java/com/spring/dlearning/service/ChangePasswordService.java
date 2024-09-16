package com.spring.dlearning.service;

import com.spring.dlearning.dto.request.ChangePasswordRequest;
import com.spring.dlearning.dto.response.ChangePasswordResponse;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.repository.UserRepository;
import com.spring.dlearning.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ChangePasswordService {

    PasswordEncoder passwordEncoder;
    UserRepository userRepository;

    @Transactional
    @PreAuthorize("isAuthenticated()")
    public ChangePasswordResponse changePassword(ChangePasswordRequest request){
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));

        if(! passwordEncoder.matches(request.getCurrentPassword(), user.getPassword()))
            throw new AppException(ErrorCode.CURRENT_PASSWORD_INVALID);

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.PASSWORD_EXISTED);
        }

        if(! Objects.equals(request.getNewPassword(), request.getConfirmPassword()))
            throw new AppException(ErrorCode.CONFIRM_PASSWORD_INVALID);

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        return ChangePasswordResponse
                .builder()
                .message("Change password successful")
                .success(true)
                .build();
    }

}
