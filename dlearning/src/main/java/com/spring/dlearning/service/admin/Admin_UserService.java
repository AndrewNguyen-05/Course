package com.spring.dlearning.service.admin;

import com.spring.dlearning.dto.response.admin.Admin_UserResponse;
import com.spring.dlearning.dto.response.admin.TeacherApplicationDetailResponse;
import com.spring.dlearning.entity.Role;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.mapper.admin.Admin_UserMapper;
import com.spring.dlearning.repository.RoleRepository;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class Admin_UserService {

    private final UserRepository userRepository;
    private final Admin_UserMapper userMapper;
    private final RoleRepository roleRepository;


    public Page<Admin_UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::toUserResponse);
    }

    public Page<Admin_UserResponse> searchUsersByKeywords(String[] keywords, Pageable pageable) {
        return userRepository.searchByMultipleKeywords(keywords, pageable)
                .map(userMapper::toUserResponse);
    }

    @Transactional
    public void banUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (user.getEnabled() != null && !user.getEnabled()) {
            throw new AppException(ErrorCode.USER_ALREADY_BANNED);
        }

        user.setEnabled(false); // Vô hiệu hóa tài khoản
        userRepository.save(user);
    }

    @Transactional
    public void unbanUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (user.getEnabled() != null && user.getEnabled()) {
            throw new AppException(ErrorCode.USER_NOT_BANNED);
        }

        user.setEnabled(true); // Kích hoạt lại tài khoản
        userRepository.save(user);
    }

    @Transactional
    public void updateUserRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Role newRole = roleRepository.findByName(roleName)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));

        user.setRole(newRole); // Update user role
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public TeacherApplicationDetailResponse getUserApplicationDetail(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return TeacherApplicationDetailResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .gender(user.getGender() != null ? user.getGender().toString() : null) // Kiểm tra null
                .avatar(user.getAvatar())
                .dob(user.getDob()) // Giữ nguyên LocalDate
                .cvUrl(user.getCvUrl())
                .certificate(user.getCertificate())
                .facebookLink(user.getFacebookLink())
                .description(user.getDescription())
                .yearsOfExperience(user.getYearsOfExperience())
                .points(user.getPoints())
                .role(user.getRole().getName())
                .build();
    }


}

