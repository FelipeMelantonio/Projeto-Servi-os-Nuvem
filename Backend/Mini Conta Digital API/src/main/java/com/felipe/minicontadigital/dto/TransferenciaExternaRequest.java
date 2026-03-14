package com.felipe.minicontadigital.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransferenciaExternaRequest {

    private Long contaOrigemId;
    private BigDecimal valor;

    private Integer banco; 
    private String agencia;
    private String conta;
    private String cpfDestino;
}
