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
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RegisterTeacherService {

    RegisterTeacherMapper registerTeacherMapper;
    UserRepository userRepository;
    RoleRepository roleRepository;
    NotificationService notificationService;
    FileService fileService;

    @PreAuthorize("hasAuthority('ADMIN')")
    public List<UserRegisterTeacherResponse> getAll() {
        return userRepository.findAll()
                .stream()
                .filter(user ->
                        user.getRegistrationStatus() != null &&
                                user.getRegistrationStatus().equals(RegistrationStatus.PENDING) &&
                                user.getRole() != null &&
                                user.getRole().getName() != null &&
                                user.getRole().getName().equals(PredefinedRole.USER_ROLE))
                .map(registerTeacherMapper::toTeacherResponse)
                .toList();
    }

    @Transactional
    @PreAuthorize("hasAuthority('USER') and isAuthenticated()")
    public UserRegisterTeacherResponse registerTeacher(UserRegisterTeacherRequest request,
                                                       MultipartFile cv,
                                                       MultipartFile certificate)
            throws IOException, URISyntaxException {

        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User userCurrent = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (userCurrent.getRegistrationStatus() == null || userCurrent.getRegistrationStatus().equals(RegistrationStatus.REJECTED)) {

            String cvFileName = fileService.store(cv, "upload");
            String certificateFileName = fileService.store(certificate, "upload");
            log.info("cv {}", cvFileName);
            log.info("certificateFileName{}", certificateFileName);

            request.setCvUrl("/upload/" + cvFileName);
            request.setCertificate("/upload/" + certificateFileName);

            registerTeacherMapper.toUpdateTeacher(request, userCurrent);
            userCurrent.setRegistrationStatus(RegistrationStatus.PENDING);
            userRepository.save(userCurrent);

            String message = "A new teacher application has been submitted.";
            String title = "New Teacher Registration";
            String url = "/admin/teacher-applications";

            List<User> userAdmin = userRepository.findByRoleName(PredefinedRole.ADMIN_ROLE);
            for (User usersAdmin : userAdmin) {
                notificationService.createNotification(usersAdmin, userCurrent, message, title, url);
            }

            return registerTeacherMapper.toTeacherResponse(userCurrent);
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

            String message = "Your application to become a teacher has been approved.";
            String title = "Teacher Registration Approved";
            String url = "/teacher";

            List<User> userAdmin = userRepository.findByRoleName(PredefinedRole.ADMIN_ROLE);
            for (User usersAdmin : userAdmin){
                notificationService.createNotification(user, usersAdmin, message, title, url);
            }
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
            user.setBio(null);
            user.setCertificate(null);
            user.setCvUrl(null);
            user.setFacebookLink(null);
            userRepository.save(user);
            log.info("RegistrationStatus {}", user.getRegistrationStatus());

            String message = "Your application to become a teacher has been rejected.";
            String title = "Teacher Registration Rejected";
            String url = "/support";

            List<User> userAdmin = userRepository.findByRoleName(PredefinedRole.ADMIN_ROLE);
            for (User usersAdmin : userAdmin){
                notificationService.createNotification(user, usersAdmin, message, title, url);
            }
        }
        return registerTeacherMapper.toTeacherResponse(user);
    }

}
