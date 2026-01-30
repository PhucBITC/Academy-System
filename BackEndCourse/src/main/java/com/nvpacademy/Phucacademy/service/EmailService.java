package com.nvpacademy.Phucacademy.service;

import com.nvpacademy.Phucacademy.model.OTP;
import com.nvpacademy.Phucacademy.reponsitory.OTPRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private OTPRepository otpRepository;

    private LocalDateTime otpGeneratedTime;

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otpValue = 100000 + random.nextInt(900000);
        return String.valueOf(otpValue);
    }

    private void createOTPEntity(String email, String otpValue) {
        LocalDateTime expireTime = LocalDateTime.now().plusMinutes(2);
        OTP newOTPEntity = new OTP();
        newOTPEntity.setEmail(email);
        newOTPEntity.setOtpValue(otpValue);
        newOTPEntity.setExpireTime(expireTime);
        otpRepository.save(newOTPEntity);
    }

    @Scheduled(cron = "0 */4 * * * *")
    public void removeOtpExpired() {
        LocalDateTime now = LocalDateTime.now();

        List<OTP> expiredOtps = otpRepository.findAllByExpireTimeBefore(now);

        if (!expiredOtps.isEmpty()) {
            otpRepository.deleteAll(expiredOtps);
            System.out.println("Removed " + expiredOtps.size() + " expired OTPs.");
        } else {
            System.out.println("No expired OTPs found.");
        }

    }

    public boolean checkOtpValid(String email, String OTP) {
        Optional<OTP> optionalOTP = otpRepository.readByEmailAndOtpValue(email, OTP);
        if (optionalOTP.isPresent()) {
            OTP otp = optionalOTP.get();
            boolean checkExpireTime = otp.getExpireTime().isAfter(LocalDateTime.now());

            if (checkExpireTime) {
                return true;
            } else {
                otpRepository.delete(otp);
                return false;
            }
        }
        return false;
    }

    public void sendMailOTP(String to, String subject) {
        String otp = generateOtp();
        Context context = new Context();
        context.setVariable("otp", otp);
        String htmlContent = templateEngine.process("otpEmail", context);
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(message, "utf-8");
        try {
            mimeMessageHelper.setTo(to);
            mimeMessageHelper.setSubject(subject);
            mimeMessageHelper.setText(htmlContent, true);
            mailSender.send(message);
            createOTPEntity(to, otp);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }

}
