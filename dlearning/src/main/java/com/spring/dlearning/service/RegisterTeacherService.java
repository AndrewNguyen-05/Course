package com.spring.dlearning.service;

import com.spring.dlearning.constant.PredefinedRole;
import com.spring.dlearning.dto.request.UserRegisterTeacherRequest;
import com.spring.dlearning.dto.response.UserRegisterTeacherResponse;
import com.spring.dlearning.entity.Role;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.RegisterTeacherMapper;
import com.spring.dlearning.repository.RoleRepository;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RegisterTeacherService {

    RegisterTeacherMapper registerTeacherMapper;
    UserRepository userRepository;
    RoleRepository roleRepository;
    CloudinaryService cloudinaryService;

    @Transactional
    @PreAuthorize("hasAuthority('USER') and isAuthenticated()")
    public UserRegisterTeacherResponse registerTeacher(UserRegisterTeacherRequest request,
                                                       MultipartFile cv,
                                                       MultipartFile certificate)
            throws IOException {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if(user.getRegistrationStatus() == null || user.getRegistrationStatus().equals(RegistrationStatus.REJECTED)){

            request.setCvUrl(cloudinaryService.uploadPDF(cv));
            request.setCertificate(cloudinaryService.uploadPDF(certificate));

            registerTeacherMapper.toUpdateTeacher(request, user);
            user.setRegistrationStatus(RegistrationStatus.PENDING);

            userRepository.save(user);

            return registerTeacherMapper.toTeacherResponse(user);
        }
        throw new AppException(ErrorCode.REGISTER_TEACHER_INVALID);
    }

    @Transactional
    @PreAuthorize("hasAuthority('ADMIN') and isAuthenticated()")
    public UserRegisterTeacherResponse saveTeacher(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        String roleName = user.getRole().getName();

        Role role = roleRepository.findByName(PredefinedRole.TEACHER_ROLE)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));

        if(user.getRegistrationStatus().equals(RegistrationStatus.PENDING)
                && roleName.equals(PredefinedRole.USER_ROLE)){
            user.setRegistrationStatus(RegistrationStatus.APPROVED);
            user.setRole(role);
            userRepository.save(user);
            return registerTeacherMapper.toTeacherResponse(user);
        }
        throw new AppException(ErrorCode.REGISTER_TEACHER_INVALID);
    }

    @Transactional
    @PreAuthorize("hasAuthority('ADMIN') and isAuthenticated()")
    public UserRegisterTeacherResponse rejectTeacher(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        String roleName = user.getRole().getName();
        log.info("Role {}", user.getRole().getName());

        Role role = roleRepository.findByName(PredefinedRole.USER_ROLE)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));


        if(user.getRegistrationStatus().equals(RegistrationStatus.PENDING)
                && roleName.equals(PredefinedRole.USER_ROLE)){
            user.setRegistrationStatus(RegistrationStatus.REJECTED);
            user.setRole(role);
            user.setCertificate(null);
            user.setCvUrl(null);
            user.setFacebookLink(null);
            userRepository.save(user);
            log.info("RegistrationStatus {}", user.getRegistrationStatus());
        }
        return registerTeacherMapper.toTeacherResponse(user);
    }

}
