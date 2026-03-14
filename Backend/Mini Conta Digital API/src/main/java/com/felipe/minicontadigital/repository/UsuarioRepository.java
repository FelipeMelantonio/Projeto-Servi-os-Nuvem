package com.felipe.minicontadigital.repository;

import com.felipe.minicontadigital.entity.Usuario;
import com.felipe.minicontadigital.enums.UserRole;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByCpf(String cpf);

    boolean existsByRole(UserRole role);
}
