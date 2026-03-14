package com.felipe.minicontadigital.repository;

import com.felipe.minicontadigital.entity.Transacao;
import com.felipe.minicontadigital.entity.Conta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransacaoRepository extends JpaRepository<Transacao, Long> {

    List<Transacao> findByContaOrigemOrContaDestinoOrderByTimestampDesc(Conta origem, Conta destino);
}
