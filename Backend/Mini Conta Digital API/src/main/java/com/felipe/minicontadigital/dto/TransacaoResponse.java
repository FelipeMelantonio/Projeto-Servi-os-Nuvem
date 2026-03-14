package com.felipe.minicontadigital.dto;

import com.felipe.minicontadigital.enums.TipoTransacao;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransacaoResponse {

    private Long id;
    private TipoTransacao tipo;
    private BigDecimal valor;

    private ContaResumoResponse contaOrigem;
    private ContaResumoResponse contaDestino; // pode ser null

    // campos de externa (podem ser null)
    private String bancoExterno;
    private String agenciaExterna;
    private String contaExterna;
    private String cpfExterno;

    private BigDecimal saldoAposOperacao;
    private LocalDateTime timestamp;
}
