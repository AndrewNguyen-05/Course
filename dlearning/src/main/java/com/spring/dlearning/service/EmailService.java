package com.spring.dlearning.service;

import com.spring.dlearning.entity.Advertisement;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.text.DecimalFormat;
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

        String html = templateEngine.process("confirm-email.html", context);
        helper.setText(html, true);

        mailSender.send(mimeMessage);

        log.info("Email sent to {}", emailTo);
    }

    @NotNull
    private static Context getContext(Advertisement advertisement) {
        Context context = new Context();
        Map<String, Object> properties = new HashMap<>();

        DecimalFormat formatter = new DecimalFormat("#,### VND");
        BigDecimal price = advertisement.getPrice();

        properties.put("title", advertisement.getTitle());
        properties.put("img", advertisement.getImage());
        properties.put("description", advertisement.getDescription());
        properties.put("link", advertisement.getLink());
        properties.put("startDate", advertisement.getStartDate().toString());
        properties.put("endDate", advertisement.getEndDate().toString());
        properties.put("priceAds", formatter.format(price));
        properties.put("status", advertisement.getApprovalStatus().name());
        properties.put("qrCodeUrl", "https://res.cloudinary.com/dznef2sae/image/upload/v1727686554/qr_code/qr_code.jpg");

        context.setVariables(properties);
        return context;
    }

}
