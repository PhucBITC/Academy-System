CREATE TABLE OTP (
                     otp_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                     email VARCHAR(255) NOT NULL,
                     otp_value VARCHAR(255) NOT NULL,
                     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                     expire_time DATETIME,
                     CONSTRAINT email_format CHECK (email REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
    );