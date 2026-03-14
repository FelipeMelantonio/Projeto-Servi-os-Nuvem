package com.felipe.minicontadigital.repository;

import com.felipe.minicontadigital.entity.Conta;
import com.felipe.minicontadigital.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContaRepository extends JpaRepository<Conta, Long> {

    Optional<Conta> findByUsuario(Usuario usuario);

    boolean existsByUsuario(Usuario usuario);
}
