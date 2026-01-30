package com.nvpacademy.Phucacademy.request;

import lombok.Data;

@Data
public class PaymentRequest {
    private Double total;
    private String currency;
    private String method;
    private String intent;
    private String description;
    private String cancelUrl;
    private String successUrl;
}
