package com.spring.dlearning.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.spring.dlearning.constant.PredefinedRole;
import com.spring.dlearning.dto.response.AuthenticationResponse;
import com.spring.dlearning.entity.Role;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.repository.RoleRepository;
import com.spring.dlearning.repository.UserRepository;
import com.spring.dlearning.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final RoleRepository roleRepository;
    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException {

        OAuth2AuthenticatedPrincipal principal = (OAuth2AuthenticatedPrincipal) authentication.getPrincipal();

        String registrationId = null;
        if (authentication instanceof OAuth2AuthenticationToken) {
            registrationId = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId();
        }

        if (registrationId == null) {
            throw new AppException(ErrorCode.UNKNOWN_PROVIDER);
        }

        String name;
        String email;
        String avatar;

        if ("github".equalsIgnoreCase(registrationId)) {
            name = principal.getAttribute("login");
            email = principal.getAttribute("email");
            avatar = principal.getAttribute("avatar_url");
            if (email == null) {
                email = principal.getAttribute("login") + "@gmail.com";
            }
        } else {
            avatar = "";
            if ("facebook".equalsIgnoreCase(registrationId)) {
                name = principal.getAttribute("name");
                email = principal.getAttribute("email");
            } else {
                throw new AppException(ErrorCode.UNKNOWN_PROVIDER);
            }
        }

        assert name != null;
        String[] nameParts = name.split(" ");
        String firstname = nameParts[0];
        String lastname = nameParts.length > 1 ? String.join(" ", Arrays.copyOfRange(nameParts, 1, nameParts.length)) : "";

        Role roles = roleRepository.findByName(PredefinedRole.USER_ROLE)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));

        String finalEmail = email;
        User user = userRepository.findByEmail(email).orElseGet(() -> userRepository.save(User.builder()
                .email(finalEmail)
                .firstName(firstname)
                .lastName(lastname)
                .name(name)
                        .avatar(avatar)
                .role(roles)
                .build()));

        String token = authenticationService.generateToken(user);

        AuthenticationResponse resp = AuthenticationResponse.builder()
                .token(token)
                .build();

        response.getWriter().write(new ObjectMapper().writeValueAsString(resp));
    }
}