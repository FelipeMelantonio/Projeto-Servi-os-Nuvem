package com.felipe.minicontadigital.service;

import com.felipe.minicontadigital.dto.TransferenciaInternaRequest;
import com.felipe.minicontadigital.entity.Conta;
import com.felipe.minicontadigital.entity.Transacao;
import com.felipe.minicontadigital.enums.TipoTransacao;
import com.felipe.minicontadigital.exception.ApiException;
import com.felipe.minicontadigital.repository.ContaRepository;
import com.felipe.minicontadigital.repository.TransacaoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransacaoService {

    private final ContaRepository contaRepository;
    private final TransacaoRepository transacaoRepository;

    public TransacaoService(
            ContaRepository contaRepository,
            TransacaoRepository transacaoRepository) {

        this.contaRepository = contaRepository;
        this.transacaoRepository = transacaoRepository;
    }

    private Conta getConta(Long id) {
        return contaRepository.findById(id)
                .orElseThrow(() -> new ApiException("Conta não encontrada.", HttpStatus.NOT_FOUND));
    }

  
    private void validarDonoConta(Conta conta, String userEmail) {
        if (userEmail == null || userEmail.isBlank() || userEmail.equals("anonymous")) {
            throw new ApiException("Unauthorized.", HttpStatus.UNAUTHORIZED);
        }

        String dono = (conta.getUsuario() != null) ? conta.getUsuario().getEmail() : null;

        if (dono == null || !dono.equalsIgnoreCase(userEmail)) {
            throw new ApiException("Você não tem permissão para movimentar esta conta.", HttpStatus.FORBIDDEN);
        }
    }

    @Transactional
    public Transacao depositar(Long contaId, BigDecimal valor, String userEmail) {
        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0)
            throw new ApiException("Valor deve ser positivo.", HttpStatus.BAD_REQUEST);

        Conta conta = getConta(contaId);
        validarDonoConta(conta, userEmail);

        conta.setSaldo(conta.getSaldo().add(valor));
        contaRepository.save(conta);

        return transacaoRepository.save(
                Transacao.builder()
                        .tipo(TipoTransacao.DEPOSITO)
                        .valor(valor)
                        .contaOrigem(conta)
                        .saldoAposOperacao(conta.getSaldo())
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    @Transactional
    public Transacao sacar(Long contaId, BigDecimal valor, String userEmail) {
        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0)
            throw new ApiException("Valor deve ser positivo.", HttpStatus.BAD_REQUEST);

        Conta conta = getConta(contaId);
        validarDonoConta(conta, userEmail);

        if (conta.getSaldo().compareTo(valor) < 0)
            throw new ApiException("Saldo insuficiente.", HttpStatus.BAD_REQUEST);

        conta.setSaldo(conta.getSaldo().subtract(valor));
        contaRepository.save(conta);

        return transacaoRepository.save(
                Transacao.builder()
                        .tipo(TipoTransacao.SAQUE)
                        .valor(valor)
                        .contaOrigem(conta)
                        .saldoAposOperacao(conta.getSaldo())
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    @Transactional
    public Transacao transferirInterna(TransferenciaInternaRequest req, String userEmail) {
        if (req.getValor() == null || req.getValor().compareTo(BigDecimal.ZERO) <= 0)
            throw new ApiException("Valor deve ser positivo.", HttpStatus.BAD_REQUEST);

        Conta origem = getConta(req.getContaOrigemId());
        validarDonoConta(origem, userEmail);

        Conta destino = getConta(req.getContaDestinoId());

        if (origem.getSaldo().compareTo(req.getValor()) < 0)
            throw new ApiException("Saldo insuficiente.", HttpStatus.BAD_REQUEST);

        origem.setSaldo(origem.getSaldo().subtract(req.getValor()));
        destino.setSaldo(destino.getSaldo().add(req.getValor()));

        contaRepository.save(origem);
        contaRepository.save(destino);

        return transacaoRepository.save(
                Transacao.builder()
                        .tipo(TipoTransacao.TRANSFERENCIA_INTERNA)
                        .valor(req.getValor())
                        .contaOrigem(origem)
                        .contaDestino(destino)
                        .saldoAposOperacao(origem.getSaldo())
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    public List<Transacao> historicoDaConta(Long contaId) {
        Conta conta = getConta(contaId);
        return transacaoRepository.findByContaOrigemOrContaDestinoOrderByTimestampDesc(conta, conta);
    }

    public List<Transacao> listarTodas() {
        return transacaoRepository.findAll();
    }
}
