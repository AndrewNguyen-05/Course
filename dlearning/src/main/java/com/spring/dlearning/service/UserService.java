package com.spring.dlearning.service;


import com.spring.dlearning.constant.PredefinedRole;
import com.spring.dlearning.dto.request.PasswordCreationRequest;
import com.spring.dlearning.dto.request.UserCreationRequest;
import com.spring.dlearning.dto.response.UserProfileResponse;
import com.spring.dlearning.dto.response.UserResponse;
import com.spring.dlearning.entity.Role;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.UserMapper;
import com.spring.dlearning.repository.RoleRepository;
import com.spring.dlearning.repository.UserRepository;
import com.spring.dlearning.repository.http_client.OutboundIdentityClient;
import com.spring.dlearning.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;
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
    SecurityUtils securityUtils;


    public UserResponse createUser(UserCreationRequest request){
        if(userRepository.findByEmail(request.getEmail()).isPresent())
            throw new AppException(ErrorCode.USER_EXISTED);


        User user = userMapper.toUser(request);
        Role role = roleRepository.findByName(PredefinedRole.USER_ROLE)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(role);
        user.setName(request.getFirstName() + " " + request.getLastName());
        userRepository.save(user);

        return userMapper.toUserResponse(user);
    }

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

    private static String generateOtp(String email){

        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for(int i = 0; i < 6 ; i++){
            otp.append(random.nextInt(10));
        }
        return otp.toString();

    }

}

