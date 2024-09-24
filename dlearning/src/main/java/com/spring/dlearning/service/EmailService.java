package com.spring.dlearning.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
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

    public void confirmLink (String emailTo, Long userId, String secretCode)
            throws MessagingException, UnsupportedEncodingException {
        log.info("Sending email ...");

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage,
                                       MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                                       StandardCharsets.UTF_8.name());

        Context context = new Context();

        String linkConfirm = "/user/userId/secretCode=xxx";

        Map<String, Object> properties = new HashMap<>();
        properties.put("linkConfirm", linkConfirm);
        context.setVariables(properties);

        helper.setFrom(emailFrom, "Le Khanh Duc");
        helper.setTo(emailTo);
        helper.setSubject("Please Confirm your account");

        String html = templateEngine.process("confirm-email.html", context);
        helper.setText(html, true);

        mailSender.send(mimeMessage);

        log.info("Email sent to {}", emailTo);
    }

}
