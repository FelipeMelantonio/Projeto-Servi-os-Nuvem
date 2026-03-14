package com.felipe.minicontadigital.service;

import com.felipe.minicontadigital.entity.Usuario;
import com.felipe.minicontadigital.exception.ApiException;
import com.felipe.minicontadigital.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ApiException("Usuário não encontrado.", HttpStatus.NOT_FOUND));
    }

    public java.util.List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }
}
