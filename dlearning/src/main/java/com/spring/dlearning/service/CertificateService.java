package com.spring.dlearning.service;

import com.spring.dlearning.dto.event.NotificationEvent;
import com.spring.dlearning.dto.request.CertificateRequest;
import com.spring.dlearning.dto.response.CertificateResponse;
import com.spring.dlearning.entity.Certificate;
import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.repository.CertificateRepository;
import com.spring.dlearning.repository.CourseRepository;
import com.spring.dlearning.repository.UserRepository;
import com.spring.dlearning.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CertificateService {

    CertificateRepository certificateRepository;
    UserRepository userRepository;
    CourseRepository courseRepository;
    KafkaTemplate<String, Object> kafkaTemplate;

    public CertificateResponse createCertificate (CertificateRequest request) {

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_EXISTED));

        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if(certificateRepository.existsByCourseAndUser(course, user))
            throw new AppException(ErrorCode.CERTIFICATE_EXISTED);

        Certificate certificate = Certificate.builder()
                .name("DLearning Certificate of Completion")
                .user(user)
                .course(course)
                .issueDate(LocalDateTime.now())
                .build();
        certificateRepository.save(certificate);

        Map<String, Object> data = new HashMap<>();
        data.put("recipient", certificate.getUser().getEmail());
        data.put("courseName", certificate.getCourse().getTitle());
        data.put("issueDate", certificate.getIssueDate().format(DateTimeFormatter.ofPattern("EEEE, dd MMMM yyyy - hh:mm:ss a")));
        data.put("author", certificate.getCourse().getAuthor().getName());

        NotificationEvent event =  NotificationEvent.builder()
                .channel("EMAIL")
                .subject("DLearning Certificate of Completion")
                .recipient(certificate.getUser().getEmail())
                .templateCode("certificate-template")
                .param(data)
                .build();

        kafkaTemplate.send("notification-delivery", event);

        return CertificateResponse.builder()
                .courseName(certificate.getCourse().getTitle())
                .email(certificate.getUser().getEmail())
                .username(certificate.getUser().getName())
                .certificateUrl(certificate.getCertificateUrl())
                .issueDate(certificate.getIssueDate())
                .build();
    }

    @PreAuthorize("isAuthenticated()")
    public List<CertificateResponse> getCertificationByUserLogin () {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return certificateRepository.findByUser(user)
                .stream()
                .map(certificate -> CertificateResponse.builder()
                        .certificateId(certificate.getId())
                        .courseName(certificate.getCourse().getTitle())
                        .author(certificate.getCourse().getAuthor().getName())
                        .email(certificate.getUser().getEmail())
                        .username(certificate.getUser().getName())
                        .certificateUrl(certificate.getCertificateUrl())
                        .issueDate(certificate.getIssueDate())
                        .build())
                .toList();
    }

}
