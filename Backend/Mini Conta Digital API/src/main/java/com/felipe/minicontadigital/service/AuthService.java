package com.felipe.minicontadigital.service;

import com.felipe.minicontadigital.entity.Usuario;
import com.felipe.minicontadigital.enums.UserRole;
import com.felipe.minicontadigital.exception.ApiException;
import com.felipe.minicontadigital.repository.UsuarioRepository;
import com.felipe.minicontadigital.security.JwtService;
import com.felipe.minicontadigital.security.UserDetailsServiceImpl;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtService jwtService;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            UserDetailsServiceImpl userDetailsService,
            JwtService jwtService) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    public Usuario registrar(String nome, String email, String senha, String cpf, UserRole role) {

        if (usuarioRepository.existsByEmail(email)) {
            throw new ApiException("E-mail já cadastrado.", HttpStatus.BAD_REQUEST);
        }
        if (usuarioRepository.existsByCpf(cpf)) {
            throw new ApiException("CPF já cadastrado.", HttpStatus.BAD_REQUEST);
        }

        UserRole roleToUse = role != null ? role : UserRole.USER;

        if (roleToUse == UserRole.ADMIN && !isAdminAuthenticated()) {
            throw new ApiException("Somente administradores podem criar outros administradores",
                    HttpStatus.FORBIDDEN);
        }

        Usuario usuario = Usuario.builder()
                .nome(nome)
                .email(email)
                .senha(passwordEncoder.encode(senha))
                .cpf(cpf)
                .role(roleToUse)
                .createdAt(LocalDateTime.now())
                .build();

        return usuarioRepository.save(usuario);
    }

    public String login(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("Usuário não encontrado.", HttpStatus.NOT_FOUND));

        if (!passwordEncoder.matches(senha, usuario.getSenha())) {
            throw new ApiException("Senha inválida.", HttpStatus.BAD_REQUEST);
        }

        var userDetails = userDetailsService.loadUserByUsername(email);
        return jwtService.generateToken(userDetails);
    }

    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("Usuário não encontrado.", HttpStatus.NOT_FOUND));
    }

    private boolean isAdminAuthenticated() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated())
            return false;

        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}
