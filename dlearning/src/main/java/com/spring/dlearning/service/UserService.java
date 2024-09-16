package com.spring.dlearning.service;


import com.spring.dlearning.constant.PredefinedRole;
import com.spring.dlearning.dto.request.PasswordCreationRequest;
import com.spring.dlearning.dto.request.UserCreationRequest;
import com.spring.dlearning.dto.request.VerifyOtpRequest;
import com.spring.dlearning.dto.response.UserResponse;
import com.spring.dlearning.dto.response.VerifyOtpResponse;
import com.spring.dlearning.entity.Role;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.UserMapper;
import com.spring.dlearning.repository.RoleRepository;
import com.spring.dlearning.repository.UserRepository;
import jakarta.mail.MessagingException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {

    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    EmailService emailService;
    OtpService otpService;

    public boolean findByEmail(String email){
       return userRepository.existsByEmail(email);
    }

    @Transactional
    public UserResponse createUser(UserCreationRequest request, String otp) throws MessagingException {
        if(userRepository.findByEmail(request.getEmail()).isPresent())
            throw new AppException(ErrorCode.USER_EXISTED);


        // Xác thực otp
        String storedOtp = otpService.getOtp(request.getEmail());
        if (storedOtp == null || !storedOtp.equals(otp)) {
            throw new AppException(ErrorCode.INVALID_OTP);
        }

        User user = userMapper.toUser(request);
        Role role = roleRepository.findByName(PredefinedRole.USER_ROLE)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(role);
        user.setName(request.getFirstName() + " " + request.getLastName());
        userRepository.save(user);

        // Xóa OTP khỏi Redis sau khi xác thực thành công
        otpService.deleteOtp(request.getEmail());

        return userMapper.toUserResponse(user);
    }

    @Transactional
    @PreAuthorize("isAuthenticated()")
    public void createPassword(PasswordCreationRequest request){

        var context = SecurityContextHolder.getContext();
        String email = context.getAuthentication().getName();

        log.info("Email --> {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if(StringUtils.hasText(user.getPassword()))
            throw new AppException(ErrorCode.PASSWORD_EXISTED);

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
    }

    public UserResponse getUserById(Long id){
        return userRepository.findById(id)
                .map(userMapper::toUserResponse)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public List<UserResponse> getAllUsers(){
        return userRepository.findAll()
                .stream().map(userMapper::toUserResponse).toList();
    }

    public UserResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String email = context.getAuthentication().getName();

        User user = userRepository.findByEmail(email).orElseThrow(()
                -> new AppException(ErrorCode.USER_NOT_EXISTED));

        UserResponse userResponse = userMapper.toUserResponse(user);

        userResponse.setNoPassword(! StringUtils.hasText(user.getPassword()));
        //true => noPassword => chưa có password
        //false => có password
        return userResponse;
    }

    @Transactional
    public void sendOtp(String email) throws MessagingException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        String otp = generateOtp();
        LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(30);

        user.setOtp(otp);
        user.setOtpExpiryDate(expiryDate);

        String subject = "Your OTP Code";
        String content = String.format(
                "<p>Hello,</p>" +
                        "<p>We received a request to reset your password. Use the following OTP to reset it:</p>" +
                        "<h2>%s</h2>" +
                        "<p>If you did not request this, please ignore this email.</p>" +
                        "<p>Best regards,<br/>Your Company</p>",
                otp
        );
        emailService.sendEmail(subject, content, List.of(email));
    }

    public void sendOtpRegister(String email) throws MessagingException {
        String otp = generateOtp();

        otpService.saveOtp(email, otp);

        String subject = "Your OTP Code for Account Registration";

        StringBuilder content = new StringBuilder();
        content.append("<html>")
                .append("<body style='font-family: Arial, sans-serif; line-height: 1.6;'>")
                .append("<h2 style='color: #4CAF50;'>Welcome to [Your Company Name]!</h2>")
                .append("<p>Dear <strong>")
                .append(email)
                .append("</strong>,</p>")
                .append("<p>Thank you for registering with <strong>[Your Company Name]</strong>. We are excited to have you on board!</p>")
                .append("<p style='font-size: 18px;'><strong>Your OTP Code is:</strong> ")
                .append("<span style='font-size: 22px; color: #FF5733;'><strong>")
                .append(otp)
                .append("</strong></span></p>")
                .append("<p><strong>Note:</strong> This OTP is valid for <em>5 minutes</em>. Please enter it as soon as possible to complete your registration.</p>")
                .append("<p>If you did not request this code, please ignore this email. For your security, do not share this code with anyone.</p>")
                .append("<br/>")
                .append("<p>Best regards,</p>")
                .append("<p><strong>[Your Company Name] Team</strong></p>")
                .append("</body>")
                .append("</html>");

        String emailContent = content.toString();
        emailService.sendEmail(subject, emailContent, List.of(email));
    }


    public VerifyOtpResponse verifyOtp(VerifyOtpRequest request){
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if(user.getOtp() == null || ! user.getOtp().equals(request.getOtp())){
            return VerifyOtpResponse.builder()
                    .valid(false)
                    .build();
        }

        if(user.getOtpExpiryDate() == null || user.getOtpExpiryDate().isBefore(LocalDateTime.now())){
            return VerifyOtpResponse.builder()
                    .valid(false)
                    .build();
        }

        return VerifyOtpResponse.builder()
                .valid(true)
                .build();
    }

    @Transactional
    public void resetPassword(String email, String otp, PasswordCreationRequest request){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            throw new AppException(ErrorCode.INVALID_OTP);
        }

        if (user.getOtpExpiryDate() == null || user.getOtpExpiryDate().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.INVALID_OTP);
        }

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setOtp(null);
        user.setOtpExpiryDate(null);
        userRepository.save(user);
    }

    private static String generateOtp(){

        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for(int i = 0; i < 6 ; i++){
            otp.append(random.nextInt(10));
        }
        return otp.toString();

    }

}

