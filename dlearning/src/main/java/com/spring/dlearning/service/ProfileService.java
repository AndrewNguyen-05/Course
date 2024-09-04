package com.spring.dlearning.service;


import com.spring.dlearning.dto.request.UserProfileRequest;
import com.spring.dlearning.dto.response.UserProfileResponse;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.ProfileMapper;
import com.spring.dlearning.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProfileService {

    UserRepository userRepository;
    ProfileMapper profileMapper;

    @Transactional
    @PreAuthorize("isAuthenticated()")
    public void updateProfile(UserProfileRequest request) {
        SecurityContext contextHolder = SecurityContextHolder.getContext();
        String email = contextHolder.getAuthentication().getName();

        if (email != null) {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            profileMapper.updateUser(request, user);

            if (request.getFirstName() != null && request.getLastName() != null) {
                user.setName(request.getFirstName() + " " + request.getLastName());
            }
            userRepository.save(user);
            log.info("User profile updated successfully for user with email: {}", email);
        }
    }

    @PreAuthorize("isAuthenticated()")
    public UserProfileResponse getInfoProfile(){
        var context = SecurityContextHolder.getContext();
        String email = context.getAuthentication().getName();

        User user = userRepository.findByEmail(email).orElseThrow(()
                -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return profileMapper.getInfoUser(user);
    }
}
