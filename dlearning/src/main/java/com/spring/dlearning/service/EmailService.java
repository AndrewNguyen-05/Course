package com.spring.dlearning.service;

import com.spring.dlearning.dto.event.NotificationEvent;
import com.spring.dlearning.entity.Advertisement;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class EmailService {

    @NonFinal
    @Value("${spring.mail.username}")
    String emailFrom;

    JavaMailSender mailSender;
    SpringTemplateEngine templateEngine;

    @Async
    public void sendEmail(String subject, String content, List<String> toList) throws MessagingException,
            UnsupportedEncodingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage);
        helper.setFrom(emailFrom, "Le Khanh Duc");
        helper.setTo(toList.toArray(new String[0]));
        helper.setSubject(subject);
        helper.setText(content, true);

        mailSender.send(mimeMessage);
    }

    public void confirmAdvertisement (String emailTo, Advertisement advertisement)
            throws MessagingException, UnsupportedEncodingException {
        log.info("Sending email ...");


        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage,
                                       MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                                       StandardCharsets.UTF_8.name());

        Context context = getContext(advertisement);

        helper.setFrom(emailFrom, "Le Khanh Duc");
        helper.setTo(emailTo);
        helper.setSubject("Please Confirm your account");

        String html = templateEngine.process("info-ads.html", context);
        helper.setText(html, true);

        mailSender.send(mimeMessage);

        log.info("Email sent to {}", emailTo);
    }

    @NotNull
    private static Context getContext(Advertisement advertisement) {
        Context context = new Context();
        Map<String, Object> properties = new HashMap<>();

        String paymentUrl = getPaymentUrlFromApi(advertisement);

        properties.put("title", advertisement.getTitle());
        properties.put("img", advertisement.getImage());
        properties.put("description", advertisement.getDescription());
        properties.put("link", advertisement.getLink());
        properties.put("startDate", advertisement.getStartDate().toString());
        properties.put("endDate", advertisement.getEndDate().toString());
        properties.put("priceAds", advertisement.getPrice().toString() + " VND");
        properties.put("status", advertisement.getApprovalStatus().name());
        properties.put("qrCodeUrl", "https://example.com/qr-code.jpg");

        properties.put("paymentUrl", paymentUrl);

        context.setVariables(properties);
        return context;
    }

    @KafkaListener(topics = "notification-delivery", groupId = "my-consumer-group")
    public void sendEmailByKafka(NotificationEvent event)
            throws MessagingException, UnsupportedEncodingException {
        log.info("Received Kafka message to send email: {}", event);

        Context context = new Context();
        context.setVariable("recipientName", event.getRecipient());
        context.setVariable("body", event.getBody());

        String htmlContent = templateEngine.process(event.getTemplateCode(), context);

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());

        helper.setFrom(emailFrom, "DLearning Team");
        helper.setTo(event.getRecipient());
        helper.setSubject(event.getSubject());
        helper.setText(htmlContent, true);

        mailSender.send(mimeMessage);

        log.info("Email sent to {} successfully!", event.getRecipient());
    }

    private static String getPaymentUrlFromApi(Advertisement advertisement) {
        String apiUrl = "http://localhost:8080/api/v1/payment/vn-pay?amount=" + advertisement.getPrice() + "&bankCode=NCB";

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.getForEntity(apiUrl, Map.class);

        Map<String, Object> result = (Map<String, Object>) response.getBody().get("result");
        return (String) result.get("paymentUrl");
    }


}
