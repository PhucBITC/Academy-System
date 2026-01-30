package com.nvpacademy.Phucacademy.request;

import lombok.Data;

@Data
public class RefreshTokenRequest {
    private String refreshToken;
    private String email;
    private String accountFrom;
}
