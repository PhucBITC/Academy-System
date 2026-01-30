package com.nvpacademy.Phucacademy.reponsitory;

import com.nvpacademy.Phucacademy.model.OTP;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OTPRepository extends JpaRepository<OTP, Long> {
    Optional<OTP> readByEmailAndOtpValue(String email, String otpValue);

    List<OTP> findAllByExpireTimeBefore(LocalDateTime now);
}
