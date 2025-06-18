package com.demo.etac.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.demo.etac.dto.SendEmailDTO;
import com.demo.etac.service.IEmailService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@Controller
@RequestMapping("/")
public class HomeController {

    @Autowired
    private IEmailService emailService;

    @RequestMapping
    public String index(Model model) {
        model.addAttribute("sendEmail", new SendEmailDTO());
        return "index";
    }

//    @RequestMapping("/sendEmail")
//    public String sendEmail(Model model) {
//        model.addAttribute("sendEmail", new SendEmailDTO());
//        return "index";
//    }

    @PostMapping("/sendEmail")
    public String sendEmailForm(@Valid @ModelAttribute("sendEmail") SendEmailDTO sendEmailDTO,
                                    BindingResult bindingResult,
                                    RedirectAttributes redirectAttributes,
                                    HttpSession session,
                                    Model model) {
        
        System.out.println("=== DEBUG: Form đã được submit ===");
        System.out.println("Name: " + sendEmailDTO.getName());
        System.out.println("Email: " + sendEmailDTO.getEmail());
        System.out.println("Phone: " + sendEmailDTO.getPhone());
        System.out.println("Subject: " + sendEmailDTO.getSubject());
        System.out.println("Message: " + sendEmailDTO.getMessage());
        
        if (bindingResult.hasErrors()) {
            System.out.println("Có lỗi validation: " + bindingResult.getAllErrors());
            model.addAttribute("sendEmail", sendEmailDTO);
            return "index";
        }

        try {
            // Gửi email cảm ơn đến người dùng
            boolean emailSent = emailService.sendThankYouEmail(
                    sendEmailDTO.getEmail(),
                    sendEmailDTO.getName(),
                    sendEmailDTO.getSubject(),
                    sendEmailDTO.getMessage()
            );

            // Gửi email thông báo cho admin
            boolean notificationSent = emailService.sendNotificationToAdmin(sendEmailDTO);

            if (emailSent) {
                System.out.println("Email đã được gửi thành công đến: " + sendEmailDTO.getEmail());
                session.setAttribute("SUCCESS_MESSAGE", "Cảm ơn bạn đã gửi thông tin liên hệ. Email xác nhận đã được gửi đến địa chỉ của bạn!");
            } else {
                System.out.println("Không thể gửi email đến: " + sendEmailDTO.getEmail());
                session.setAttribute("ERROR_MESSAGE", "Không thể gửi email xác nhận. Vui lòng thử lại sau!");
            }
            return "redirect:/";
        } catch (Exception e) {
            System.out.println("Đã xảy ra lỗi khi gửi email: " + e.getMessage());
            session.setAttribute("ERROR_MESSAGE", "Đã xảy ra lỗi: " + e.getMessage());
            return "redirect:/";
        }
    }
}
