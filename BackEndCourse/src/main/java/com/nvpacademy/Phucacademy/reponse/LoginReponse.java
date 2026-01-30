package com.nvpacademy.Phucacademy.reponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginReponse {
    private String email;
    private String pwd;
    private boolean checkedRememberMe;
}
