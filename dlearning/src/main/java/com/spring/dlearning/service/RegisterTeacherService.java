package com.spring.dlearning.service;

import com.spring.dlearning.dto.request.UserRegisterTeacherRequest;
import com.spring.dlearning.dto.response.UserRegisterTeacherResponse;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.RegisterTeacherMapper;
import com.spring.dlearning.repository.UserRepository;
import com.spring.dlearning.utils.RegistrationStatus;
import com.spring.dlearning.utils.SecurityUtils;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RegisterTeacherService {

    RegisterTeacherMapper registerTeacherMapper;
    UserRepository userRepository;

    @Transactional
    @PreAuthorize("hasAuthority('USER') and isAuthenticated()")
    public UserRegisterTeacherResponse registerTeacher(UserRegisterTeacherRequest userRegisterTeacherRequest) {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if(user.getRegistrationStatus() == null){
            registerTeacherMapper.toUpdateTeacher(userRegisterTeacherRequest, user);

            user.setRegistrationStatus(RegistrationStatus.PENDING);
            userRepository.save(user);

            return registerTeacherMapper.toTeacherResponse(user);
        }

        throw new AppException(ErrorCode.REGISTER_TEACHER_INVALID);

    }

}
