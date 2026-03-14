package com.felipe.minicontadigital.controller;

import com.felipe.minicontadigital.dto.AuthLoginRequest;
import com.felipe.minicontadigital.dto.AuthLoginResponse;
import com.felipe.minicontadigital.dto.AuthRegisterRequest;
import com.felipe.minicontadigital.entity.Usuario;
import com.felipe.minicontadigital.enums.UserRole;
import com.felipe.minicontadigital.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/registrar")
    public ResponseEntity<Usuario> registrar(@RequestBody AuthRegisterRequest request) {
        UserRole role = request.getRole(); 
        Usuario usuario = authService.registrar(
                request.getNome(),
                request.getEmail(),
                request.getSenha(),
                request.getCpf(),
                role);
        return ResponseEntity.ok(usuario);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthLoginResponse> login(@RequestBody AuthLoginRequest request) {
        String token = authService.login(request.getEmail(), request.getSenha());
        
        // Buscar o usuário para retornar seus dados junto com o token
        Usuario usuario = authService.buscarPorEmail(request.getEmail());
        
        return ResponseEntity.ok(new AuthLoginResponse(token, usuario));
    }
}
