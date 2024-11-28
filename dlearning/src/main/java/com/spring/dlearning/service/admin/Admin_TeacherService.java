package com.spring.dlearning.service.admin;

import com.spring.dlearning.constant.PredefinedRole;
import com.spring.dlearning.dto.response.admin.Admin_TeacherResponse;
import com.spring.dlearning.dto.response.admin.Admin_UserResponse;
import com.spring.dlearning.dto.response.admin.TeacherApplicationDetailResponse;
import com.spring.dlearning.entity.Role;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.admin.Admin_TeacherMapper;
import com.spring.dlearning.mapper.admin.Admin_UserMapper;
import com.spring.dlearning.repository.RoleRepository;
import com.spring.dlearning.repository.UserRepository;
import com.spring.dlearning.utils.RegistrationStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class Admin_TeacherService {

    private final UserRepository userRepository;
    private final Admin_TeacherMapper teacherMapper;
    private final RoleRepository roleRepository;
    private final Admin_UserMapper userMapper;

    public Page<Admin_TeacherResponse> getAllTeachers(Pageable pageable) {
        return userRepository.findByRoleName(PredefinedRole.TEACHER_ROLE, pageable)
                .map(teacherMapper::toTeacherResponse);
    }

    public Page<Admin_TeacherResponse> searchTeachersByKeywords(String[] keywords, Pageable pageable) {
        return userRepository.searchByRoleAndMultipleKeywords(PredefinedRole.TEACHER_ROLE, keywords, pageable)
                .map(teacherMapper::toTeacherResponse);
    }

    @Transactional
    public void approveTeacherRegistration(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (user.getRegistrationStatus() != RegistrationStatus.PENDING) {
            throw new AppException(ErrorCode.REGISTRATION_NOT_PENDING);
        }

        Role teacherRole = roleRepository.findByName(PredefinedRole.TEACHER_ROLE)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));

        user.setRole(teacherRole);
        user.setRegistrationStatus(RegistrationStatus.APPROVED);
        userRepository.save(user);
    }

    @Transactional
    public void rejectTeacherRegistration(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)); // Sử dụng ErrorCode

        if (user.getRegistrationStatus() != RegistrationStatus.PENDING) {
            throw new AppException(ErrorCode.REGISTRATION_NOT_PENDING); // Sử dụng ErrorCode
        }

        user.setRegistrationStatus(RegistrationStatus.REJECTED);
        userRepository.save(user);
    }

    @Transactional
    public void removeTeacherRole(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Role userRole = roleRepository.findByName(PredefinedRole.USER_ROLE)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));

        user.setRole(userRole);
        user.setRegistrationStatus(null);
        userRepository.save(user);
    }

    public Page<Admin_UserResponse> getPendingTeacherApplications(Pageable pageable) {
        return userRepository.findByRoleNameAndRegistrationStatus(PredefinedRole.USER_ROLE, RegistrationStatus.PENDING, pageable)
                .map(userMapper::toUserResponse);
    }


}
