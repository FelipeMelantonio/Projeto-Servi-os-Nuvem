package com.felipe.minicontadigital.service;

import com.felipe.minicontadigital.entity.Conta;
import com.felipe.minicontadigital.entity.Usuario;
import com.felipe.minicontadigital.enums.StatusConta;
import com.felipe.minicontadigital.exception.ApiException;
import com.felipe.minicontadigital.repository.ContaRepository;
import com.felipe.minicontadigital.repository.UsuarioRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class ContaService {

    private final ContaRepository contaRepository;
    private final UsuarioRepository usuarioRepository;

    public ContaService(ContaRepository contaRepository, UsuarioRepository usuarioRepository) {
        this.contaRepository = contaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Conta criarContaParaUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ApiException("Usuário não encontrado.", HttpStatus.NOT_FOUND));

        if (contaRepository.existsByUsuario(usuario)) {
            throw new ApiException("Usuário já possui conta.", HttpStatus.BAD_REQUEST);
        }

        Conta conta = Conta.builder()
                .usuario(usuario)
                .numeroConta(gerarNumeroConta())
                .saldo(BigDecimal.ZERO)
                .status(StatusConta.ATIVA)
                .dataCriacao(LocalDateTime.now())
                .build();

        return contaRepository.save(conta);
    }

    public Conta buscarPorId(Long id) {
        return contaRepository.findById(id)
                .orElseThrow(() -> new ApiException("Conta não encontrada.", HttpStatus.NOT_FOUND));
    }

    public Conta buscarPorUsuarioId(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ApiException("Usuário não encontrado.", HttpStatus.NOT_FOUND));
        return contaRepository.findByUsuario(usuario)
                .orElseThrow(() -> new ApiException("Conta não encontrada para este usuário.", HttpStatus.NOT_FOUND));
    }

    public java.util.List<Conta> listarTodas() {
        return contaRepository.findAll();
    }

    private String gerarNumeroConta() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }
}
