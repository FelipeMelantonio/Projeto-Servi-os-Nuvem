package com.felipe.minicontadigital.dto;

import com.felipe.minicontadigital.entity.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthLoginResponse {
    private String token;
    private Usuario user;
}
