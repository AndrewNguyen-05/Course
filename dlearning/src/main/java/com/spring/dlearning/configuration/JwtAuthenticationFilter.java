//package com.spring.dlearning.configuration;
//
//import com.nimbusds.jose.JOSEException;
//import com.nimbusds.jwt.SignedJWT;
//import com.spring.dlearning.entity.User;
//import com.spring.dlearning.service.AuthenticationService;
//import com.spring.dlearning.repository.UserRepository;
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//import java.text.ParseException;
//import java.util.List;
//import java.util.Optional;
//
//@Slf4j
//@RequiredArgsConstructor
//@Component
//public class JwtAuthenticationFilter extends OncePerRequestFilter {
//
//    private final AuthenticationService authenticationService;
//    private final UserRepository userRepository;
//
//    private final List<AntPathRequestMatcher> publicMatchers = List.of(
//            new AntPathRequestMatcher("/api/v1/auth/token"),
//            new AntPathRequestMatcher("/api/v1/register"),
//            new AntPathRequestMatcher("/api/v1/auth/logout"),
//            new AntPathRequestMatcher("/css/**"),
//            new AntPathRequestMatcher("/img/**"),
//            new AntPathRequestMatcher("/js/**"),
//            new AntPathRequestMatcher("/lib/**"),
//            new AntPathRequestMatcher("/scss/**"),
//            new AntPathRequestMatcher("/"),
//            new AntPathRequestMatcher("/home"),
//            new AntPathRequestMatcher("/api/v1/auth/introspect"),
//            new AntPathRequestMatcher("/api/v1/auth/refresh"),
//            new AntPathRequestMatcher("/login"),
//            new AntPathRequestMatcher("/templates/**"),
//            new AntPathRequestMatcher("/register"),
//            new AntPathRequestMatcher("/api/v1/auth/outbound/authentication"),
//            new AntPathRequestMatcher("/oauth2/authorization/**"),
//            new AntPathRequestMatcher("/create-password"),
//            new AntPathRequestMatcher("/authenticate"),
//            new AntPathRequestMatcher("/api/v1/create-password"),
//            new AntPathRequestMatcher("/authenticate-fb")
//    );
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request,
//                                    HttpServletResponse response,
//                                    FilterChain filterChain) throws ServletException, IOException {
//
//        for (AntPathRequestMatcher matcher : publicMatchers) {
//            if (matcher.matches(request)) {
//                filterChain.doFilter(request, response);
//                return;
//            }
//        }
//
//        final String token = getTokenFromRequest(request);
//
//        if (token == null) {
//            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
//            return;
//        }
//
//        try {
//            SignedJWT signedJWT = authenticationService.verifyToken(token, false);
//
//            String email = signedJWT.getJWTClaimsSet().getSubject();
//            Optional<User> userOptional = userRepository.findByEmail(email);
//
//            if (userOptional.isEmpty()) {
//                response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
//                return;
//            }
//
//            User user = userOptional.get();
//
//            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
//                    user,
//                    null,
//                    user.getAuthorities()
//            );
//
//            SecurityContextHolder.getContext().setAuthentication(authToken);
//            filterChain.doFilter(request, response);
//
//        } catch (JOSEException | ParseException e) {
//            log.error("Error during token verification", e);
//            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
//        }
//    }
//
//    private String getTokenFromRequest(HttpServletRequest request) {
//        String authHeader = request.getHeader("Authorization");
//        if (authHeader != null && authHeader.startsWith("Bearer ")) {
//            return authHeader.substring(7);
//        }
//        return null;
//    }
//}
