package com.nvpacademy.Phucacademy.request;

import lombok.Data;

@Data
public class ExecutePaymentRequest {
    private String paymentId;
    private String payerId;
}
