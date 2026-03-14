package com.felipe.minicontadigital.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.felipe.minicontadigital.enums.StatusConta;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String numeroConta;

    private BigDecimal saldo;

    private LocalDateTime dataCriacao;

    @Enumerated(EnumType.STRING)
    private StatusConta status;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @OneToMany(mappedBy = "contaOrigem", cascade = CascadeType.ALL, orphanRemoval = false)
    @JsonIgnore
    private List<Transacao> transacoesOrigem;

    @OneToMany(mappedBy = "contaDestino", cascade = CascadeType.ALL, orphanRemoval = false)
    @JsonIgnore
    private List<Transacao> transacoesDestino;
}
