package com.nvpacademy.Phucacademy.rest;

import com.nvpacademy.Phucacademy.reponse.PaymentResponse;
import com.nvpacademy.Phucacademy.request.ExecutePaymentRequest;
import com.nvpacademy.Phucacademy.request.PaymentRequest;
import com.nvpacademy.Phucacademy.service.PayService;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    @Autowired
    private PayService payService;

    private static final String SUCCESS_URL = "http://localhost:8080/api/payments/success";
    private static final String CANCEL_URL = "http://localhost:8080/api/payments/cancel";

    @PostMapping("/create")
    public ResponseEntity<?> createPayment(@RequestBody PaymentRequest paymentRequest) {
        try {
            Payment payment = payService.createPaymentWithPayPal(
                    paymentRequest.getTotal(),
                    paymentRequest.getCurrency(),
                    paymentRequest.getMethod(),
                    paymentRequest.getIntent(),
                    paymentRequest.getDescription(),
                    paymentRequest.getCancelUrl(),
                    paymentRequest.getSuccessUrl());

            // Lấy URL phê duyệt (approval URL) từ danh sách links
            String approvalUrl = payment.getLinks().stream()
                    .filter(link -> "approval_url".equals(link.getRel()))
                    .findFirst()
                    .map(link -> link.getHref())
                    .orElse(null);

            PaymentResponse response = new PaymentResponse(
                    payment.getId(),
                    payment.getState(),
                    approvalUrl);

            return ResponseEntity.ok(response);
        } catch (PayPalRESTException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/execute")
    public ResponseEntity<?> executePayment(@RequestBody ExecutePaymentRequest executePaymentRequest) {
        try {
            Payment payment = payService.excutePayment(
                    executePaymentRequest.getPaymentId(),
                    executePaymentRequest.getPayerId());
            return ResponseEntity.ok(payment);
        } catch (PayPalRESTException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
