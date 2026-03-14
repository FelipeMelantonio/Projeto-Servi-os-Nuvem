package com.felipe.minicontadigital.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransferenciaInternaRequest {
    private Long contaOrigemId;
    private Long contaDestinoId;
    private BigDecimal valor;
}
