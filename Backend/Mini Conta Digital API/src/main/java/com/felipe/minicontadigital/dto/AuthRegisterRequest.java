package com.felipe.minicontadigital.dto;

import com.felipe.minicontadigital.enums.UserRole;
import lombok.Data;

@Data
public class AuthRegisterRequest {
    private String nome;
    private String email;
    private String senha;
    private String cpf;
    private UserRole role; 
}
