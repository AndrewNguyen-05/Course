package com.spring.dlearning.service;


import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.spring.dlearning.constant.PredefinedRole;
import com.spring.dlearning.dto.request.*;
import com.spring.dlearning.dto.response.AuthenticationResponse;
import com.spring.dlearning.dto.response.ExchangeTokenResponse;
import com.spring.dlearning.dto.response.IntrospectResponse;
import com.spring.dlearning.dto.response.OutboundFacebookResponse;
import com.spring.dlearning.entity.InvalidatedToken;
import com.spring.dlearning.entity.Role;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.repository.InvalidatedTokenRepository;
import com.spring.dlearning.repository.RoleRepository;
import com.spring.dlearning.repository.UserRepository;
import com.spring.dlearning.repository.http_client.OutboundFacebookIdentityClient;
import com.spring.dlearning.repository.http_client.OutboundFacebookUserClient;
import com.spring.dlearning.repository.http_client.OutboundIdentityClient;
import com.spring.dlearning.repository.http_client.OutboundUserClient;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationService {

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    @NonFinal
    @Value("${outbound.identity.client-id}")
    protected String CLIENT_ID;

    @NonFinal
    @Value("${outbound.identity.client-secret}")
    protected String CLIENT_SECRET;

    @NonFinal
    @Value("${outbound.identity.redirect-uri}")
    protected String REDIRECT_URI;

    @NonFinal
    @Value("${outbound.identity.grant-type}")
    protected String GRANT_TYPE;


    @NonFinal
    @Value("${outbound.facebook.client-id}")
    protected String CLIENT_ID_FB;

    @NonFinal
    @Value("${outbound.facebook.client-secret}")
    protected String CLIENT_SECRET_FB;

    @NonFinal
    @Value("${outbound.facebook.redirect-uri}")
    protected String REDIRECT_URI_FB;

    @NonFinal
    @Value("${outbound.facebook.grant-type}")
    protected String GRANT_TYPE_FB;


    UserRepository userRepository;
    RoleRepository roleRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;
    OutboundIdentityClient outboundIdentityClient;
    OutboundUserClient outboundUserClient;
    OutboundFacebookIdentityClient facebookIdentityClient;
    OutboundFacebookUserClient facebookUserClient;


    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        var user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated) throw new AppException(ErrorCode.UNAUTHENTICATED);

        var token = generateToken(user);

        return AuthenticationResponse.builder().token(token).authenticated(true).build();
    }


    public AuthenticationResponse outboundAuthenticate(String code) {
        ExchangeTokenResponse response = outboundIdentityClient.exchangeToken(ExchangeTokenRequest.builder()
                .code(code)
                .clientId(CLIENT_ID)
                .clientSecret(CLIENT_SECRET)
                .redirectUri(REDIRECT_URI)
                .grantType(GRANT_TYPE)
                .build());
        log.info("TOKEN RESPONSE {}", response);

        var userInfo = outboundUserClient.getUserInfo("json", response.getAccessToken());
        log.info("User info {}", userInfo);

        Role roles = roleRepository.findByName(PredefinedRole.USER_ROLE)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));

        var user = userRepository.findByEmail(userInfo.getEmail()).orElseGet(() -> userRepository.save(User.builder()
                .email(userInfo.getEmail())
                .name(userInfo.getName())
                .firstName(userInfo.getGivenName())
                .lastName(userInfo.getFamilyName())
                .avatar(userInfo.getPicture())
                .role(roles)
                .build()));

        var token = generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .build();
    }

    public AuthenticationResponse facebookAuthenticate(String code) {

        var response = facebookIdentityClient.exchangeToken(ExchangeTokenRequest.builder()
                .code(code)
                .clientId(CLIENT_ID_FB)
                .clientSecret(CLIENT_SECRET_FB)
                .redirectUri(REDIRECT_URI_FB)
                .grantType(GRANT_TYPE_FB)
                .build());
        log.info("FACEBOOK TOKEN RESPONSE {}", response);

        OutboundFacebookResponse userInfo = facebookUserClient.getUserInfo(
                "email,first_name,last_name,picture",
                response.getAccessToken());

        log.info("Facebook User info {}", userInfo);

        Role roles = roleRepository.findByName(PredefinedRole.USER_ROLE)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));

        var user = userRepository.findByEmail(userInfo.getEmail()).orElseGet(() -> {
            User newUser = User.builder()
                    .email(userInfo.getEmail())
                    .name(userInfo.getFirstName() +" "+ userInfo.getLastName())
                    .firstName(userInfo.getFirstName())
                    .lastName(userInfo.getLastName())
                    .avatar(userInfo.getPicture().getPicture().getUrl())
                    .role(roles)
                    .build();
            return userRepository.save(newUser);
        });

        var token = generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .build();
    }


    private String generateToken(User user) {

        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(VALID_DURATION, ChronoUnit.HOURS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .build();

        Payload payload = new Payload(claimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(jwsHeader, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            var signToken = verifyToken(request.getToken(), true);

            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            if (!invalidatedTokenRepository.existsById(jit)) {
                InvalidatedToken invalidatedToken =
                        InvalidatedToken.builder().id(jit).expiryTime(expiryTime).build();

                invalidatedTokenRepository.save(invalidatedToken);
            } else {
                log.info("Token has already been invalidated");
            }

        } catch (AppException exception) {
            log.info("Token already expired or invalid");
        }
    }


    public SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {

        JWSVerifier verifier =
                new MACVerifier(SIGNER_KEY.getBytes()); // Kiểm tra chữ kí có khớp với chữ ký hệ thống hay không

        SignedJWT signedJWT = SignedJWT.parse(token); // phân tích chuỗi token

        Date expiryTime = (isRefresh)
                ? new Date(signedJWT
                .getJWTClaimsSet()
                .getIssueTime()
                .toInstant()
                .plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS)
                .toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        // lấy thời gian hết hạn của token, hàm này nhận vào 1 cái cờ, boolean => nếu người dùng hàm này để verify thì
        // thời gian khác
        // nếu dùng để refresh token thì thời gian hết hạn token sẽ khác
        var verified = signedJWT.verify(verifier); // Kiểm tra xem chữ ký có khớp với nội dung token hay không

        if (!(verified && expiryTime.after(new Date()))) throw new AppException(ErrorCode.UNAUTHENTICATED);
        // Kiểm tra xem chữ kí và token còn hiệu lực hay không => ! : nghĩa là nếu cả 2 không đúng => throw ra lỗi

        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        // Nếu JWT ID đó mà có trong bảng InvalidatedToken thì chứng tỏ token đó đã Logout

        return signedJWT; // nếu token hợp lệ thì return về đối tượng SignedJWT để xác thực token, hoặc giải mã, truy
        // xuất thông tin....
    }

    public AuthenticationResponse refreshToken(RefreshTokenRequest request) throws ParseException, JOSEException {

        var signJWT = verifyToken(request.getToken(), true);

        var jit = signJWT.getJWTClaimsSet().getJWTID();
        var expiryTime = signJWT.getJWTClaimsSet().getExpirationTime();

        // Lưu token hiện tại vào bảng invalidedToken, bởi vì khi refreshToken thì token cũ phải bị vô hiệu hóa
        InvalidatedToken invalidatedToken = InvalidatedToken.builder().id(jit).expiryTime(expiryTime).build();
        invalidatedTokenRepository.save(invalidatedToken);

        var email = signJWT.getJWTClaimsSet().getSubject();
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        var token = generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {

        var token = request.getToken();

        boolean isValid = true;
        try {
            verifyToken(token, false);
        } catch (AppException e) {
            isValid = false;
        }
        return IntrospectResponse.builder().valid(isValid).build();
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");

        Optional.ofNullable(user.getRole()).ifPresent(role -> {
            stringJoiner.add(role.getName());

            Optional.ofNullable(role.getPermissions()).ifPresent(permissions -> {
                permissions.forEach(permission -> stringJoiner.add(permission.getName()));
            });
        });
        return stringJoiner.toString();
    }
}
