package com.nvpacademy.Phucacademy.interfaces;

import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;

public interface IPayService {
    Payment createPaymentWithPayPal(Double total, String currency, String method, String intent, String des,
            String cancelUrl, String successUrl)
            throws PayPalRESTException;

    Payment excutePayment(String paymentId, String payerId) throws PayPalRESTException;

}
