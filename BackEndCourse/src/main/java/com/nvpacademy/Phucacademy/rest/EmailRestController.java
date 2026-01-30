package com.nvpacademy.Phucacademy.rest;

import com.nvpacademy.Phucacademy.model.OTP;
import com.nvpacademy.Phucacademy.request.EmailSendRequest;
import com.nvpacademy.Phucacademy.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;

@Slf4j
@RestController
@RequestMapping(path = "/api/email", produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
public class EmailRestController {
    @Autowired
    private EmailService emailService;

    @PostMapping("/public/sendEmailOTP")
    public ResponseEntity<String> sendEmailOTP(@RequestBody EmailSendRequest emailSendRequest) {
        emailService.sendMailOTP(emailSendRequest.getEmailSend(), emailSendRequest.getSubject());
        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Send OTP Email success");
    }

    @PostMapping("/public/checkOTPValid")
    public ResponseEntity<Boolean> checkOTPValid(@RequestBody OTP otp) {
        Boolean checkOTPValid = emailService.checkOtpValid(otp.getEmail(), otp.getOtpValue());
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(checkOTPValid);

    }

}
