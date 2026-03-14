package com.felipe.minicontadigital.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DepositoRequest {
    private Long contaId;
    private BigDecimal valor;
}
