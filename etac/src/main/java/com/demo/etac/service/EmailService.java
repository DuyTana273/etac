package com.demo.etac.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.demo.etac.dto.SendEmailDTO;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService implements IEmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Override
    public boolean sendThankYouEmail(String to, String name, String subject, String content) {
        try {
            // Tạo thông điệp email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Thiết lập các thông số của email
            helper.setFrom(senderEmail);
            helper.setTo(to);
            helper.setSubject(subject);

            // Tạo context chứa các biến cho template
            Context context = new Context();
            context.setVariable("name", name);
            context.setVariable("content", content);

            // Tạo nội dung HTML từ template
            String htmlContent = templateEngine.process("email/thank-you-template", context);
            helper.setText(htmlContent, true);

            // Gửi email
            mailSender.send(message);
            logger.info("Email cảm ơn đã được gửi thành công đến: {}", to);
            return true;
        } catch (MessagingException e) {
            logger.error("Không thể gửi email cảm ơn đến: {}", to, e);
            return false;
        }
    }

    @Override
    public boolean sendNotificationToAdmin(SendEmailDTO thankYouEmailDTO) {
        try {
            // Tạo thông điệp email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Thiết lập các thông số của email
            helper.setFrom(senderEmail);
            helper.setTo(senderEmail); // Gửi cho chính mình (admin)
            helper.setSubject("Thông báo: Có người dùng mới điền form liên hệ");

            // Tạo context chứa các biến cho template
            Context context = new Context();
            context.setVariable("senderEmail", thankYouEmailDTO);

            // Tạo nội dung HTML từ template
            String htmlContent = templateEngine.process("email/admin-notification-template", context);
            helper.setText(htmlContent, true);

            // Gửi email
            mailSender.send(message);
            logger.info("Email thông báo đã được gửi thành công đến Admin");
            return true;
        } catch (MessagingException e) {
            logger.error("Không thể gửi email thông báo đến admin", e);
            return false;
        }
    }
}
