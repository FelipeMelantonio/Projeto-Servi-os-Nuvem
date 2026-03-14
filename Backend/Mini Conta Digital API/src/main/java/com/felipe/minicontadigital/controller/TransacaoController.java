package com.felipe.minicontadigital.controller;

import com.felipe.minicontadigital.dto.*;
import com.felipe.minicontadigital.entity.Conta;
import com.felipe.minicontadigital.entity.Transacao;
import com.felipe.minicontadigital.service.AuditLogService;
import com.felipe.minicontadigital.service.BancoService;
import com.felipe.minicontadigital.service.TransacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transacoes")
public class TransacaoController {

    private final TransacaoService transacaoService;
    private final AuditLogService auditLogService;
    private final BancoService bancoService;

    public TransacaoController(TransacaoService transacaoService,
            AuditLogService auditLogService,
            BancoService bancoService) {
        this.transacaoService = transacaoService;
        this.auditLogService = auditLogService;
        this.bancoService = bancoService;
    }

    @PostMapping("/deposito")
    public ResponseEntity<TransacaoResponse> deposito(@RequestBody DepositoRequest request,
            Authentication auth) {

        String userEmail = auth != null ? auth.getName() : "anonymous";
        Transacao t = transacaoService.depositar(request.getContaId(), request.getValor(), userEmail);

        auditLogService.registrar(userEmail, "POST /transacoes/deposito", request);

        return ResponseEntity.ok(toResponse(t));
    }

    @PostMapping("/saque")
    public ResponseEntity<TransacaoResponse> saque(@RequestBody SaqueRequest request,
            Authentication auth) {

        String userEmail = auth != null ? auth.getName() : "anonymous";
        Transacao t = transacaoService.sacar(request.getContaId(), request.getValor(), userEmail);

        auditLogService.registrar(userEmail, "POST /transacoes/saque", request);

        return ResponseEntity.ok(toResponse(t));
    }

    @PostMapping("/transferencia-interna")
    public ResponseEntity<TransacaoResponse> transferenciaInterna(
            @RequestBody TransferenciaInternaRequest request,
            Authentication auth) {

        String userEmail = auth != null ? auth.getName() : "anonymous";
        Transacao t = transacaoService.transferirInterna(request, userEmail);

        String origemEmail = (t.getContaOrigem() != null && t.getContaOrigem().getUsuario() != null)
                ? t.getContaOrigem().getUsuario().getEmail()
                : "desconhecido";

        String destinatarioEmail = (t.getContaDestino() != null && t.getContaDestino().getUsuario() != null)
                ? t.getContaDestino().getUsuario().getEmail()
                : "desconhecido";

        String extra = "origemEmail=" + origemEmail + " destinatarioEmail=" + destinatarioEmail;

        auditLogService.registrar(
                userEmail,
                "POST /transacoes/transferencia-interna",
                request,
                extra);

        return ResponseEntity.ok(toResponse(t));
    }

    @PostMapping("/transferencia-externa")
    public ResponseEntity<TransacaoResponse> transferenciaExterna(
            @RequestBody TransferenciaExternaRequest request,
            Authentication auth) {

        String userEmail = auth != null ? auth.getName() : "anonymous";
        Transacao t = transacaoService.transferirExterna(request, userEmail);

        String bancoNome = bancoService.buscarPorCodigo(request.getBanco())
                .map(BancoResponse::getName)
                .orElse("desconhecido");

        String extra = "banco=" + bancoNome;

        auditLogService.registrar(
                userEmail,
                "POST /transacoes/transferencia-externa",
                request,
                extra);

        return ResponseEntity.ok(toResponse(t));
    }

    @GetMapping("/conta/{contaId}")
    public ResponseEntity<List<TransacaoResponse>> historico(@PathVariable Long contaId,
            Authentication auth) {

        List<Transacao> lista = transacaoService.historicoDaConta(contaId);

        String userEmail = auth != null ? auth.getName() : "anonymous";
        auditLogService.registrar(userEmail, "GET /transacoes/conta/" + contaId, null);

        return ResponseEntity.ok(lista.stream().map(this::toResponse).toList());
    }

    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TransacaoResponse>> listarTodas() {
        List<Transacao> lista = transacaoService.listarTodas();
        return ResponseEntity.ok(lista.stream().map(this::toResponse).toList());
    }

    // ===== MAPPER (Entity -> DTO) =====

    private TransacaoResponse toResponse(Transacao t) {
        return TransacaoResponse.builder()
                .id(t.getId())
                .tipo(t.getTipo())
                .valor(t.getValor())
                .contaOrigem(toContaResumo(t.getContaOrigem()))
                .contaDestino(toContaResumo(t.getContaDestino()))
                .bancoExterno(t.getBancoExterno())
                .agenciaExterna(t.getAgenciaExterna())
                .contaExterna(t.getContaExterna())
                .cpfExterno(t.getCpfExterno())
                .saldoAposOperacao(t.getSaldoAposOperacao())
                .timestamp(t.getTimestamp())
                .build();
    }

    private ContaResumoResponse toContaResumo(Conta c) {
        if (c == null)
            return null;

        String email = (c.getUsuario() != null) ? c.getUsuario().getEmail() : null;

        return ContaResumoResponse.builder()
                .id(c.getId())
                .numeroConta(c.getNumeroConta())
                .saldo(c.getSaldo())
                .status(c.getStatus())
                .usuarioEmail(email)
                .build();
    }
}
