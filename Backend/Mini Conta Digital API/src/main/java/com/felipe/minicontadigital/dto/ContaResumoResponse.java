package com.felipe.minicontadigital.dto;

import com.felipe.minicontadigital.enums.StatusConta;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContaResumoResponse {
    private Long id;
    private String numeroConta;
    private BigDecimal saldo;
    private StatusConta status;

    // opcional (p/ auditoria/clareza)
    private String usuarioEmail;
}
