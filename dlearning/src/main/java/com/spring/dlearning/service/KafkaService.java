package com.spring.dlearning.service;

import com.spring.dlearning.dto.event.CertificateCreationEvent;
import com.spring.dlearning.dto.event.NotificationEvent;
import com.spring.dlearning.dto.response.CertificateResponse;
import com.spring.dlearning.entity.Certificate;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.repository.CertificateRepository;
import com.spring.dlearning.repository.CourseRepository;
import com.spring.dlearning.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class KafkaService {

    UserRepository userRepository;
    CourseRepository courseRepository;
    CertificateRepository certificateRepository;
    KafkaTemplate<String, Object> kafkaTemplate;

    @KafkaListener(topics ="certificate-creation", groupId = "certificate-group")
    public CertificateResponse createCertificate(CertificateCreationEvent creationEvent) {
        log.info("Processing certificate creation for userId: {}, courseId: {}", creationEvent.getUserId(), creationEvent.getCourseId());

        Certificate certificate = Certificate.builder()
                .name("DLearning Certificate of Completion")
                .user(userRepository.findById(creationEvent.getUserId())
                        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)))
                .course(courseRepository.findById(creationEvent.getCourseId())
                        .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_EXISTED)))
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
                .certificateId(certificate.getId())
                .email(certificate.getUser().getEmail())
                .courseName(certificate.getCourse().getTitle())
                .author(certificate.getCourse().getAuthor().getName())
                .certificateUrl(certificate.getCertificateUrl())
                .issueDate(certificate.getIssueDate())
                .build();
    }
}
