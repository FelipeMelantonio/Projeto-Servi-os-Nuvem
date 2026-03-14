package com.felipe.minicontadigital.dto;

import lombok.Data;

@Data
public class AuthLoginRequest {
    private String email;
    private String senha;
}
