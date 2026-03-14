package com.felipe.minicontadigital.config;

import com.felipe.minicontadigital.entity.Usuario;
import com.felipe.minicontadigital.enums.UserRole;
import com.felipe.minicontadigital.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
public class AdminBootstrapConfig {

    @Bean
    public CommandLineRunner createDefaultAdmin(UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {

            if (usuarioRepository.existsByRole(UserRole.ADMIN)) {
                return;
            }

            Usuario admin = Usuario.builder()
                    .nome("Administrador")
                    .email("admin@admin.com")
                    .senha(passwordEncoder.encode("admin123"))
                    .cpf("00000000000")
                    .role(UserRole.ADMIN)
                    .createdAt(LocalDateTime.now())
                    .build();

            usuarioRepository.save(admin);

            System.out.println(">>> ADMIN padrão criado: login=admin@admin.com  senha=admin123");
        };
    }
}
