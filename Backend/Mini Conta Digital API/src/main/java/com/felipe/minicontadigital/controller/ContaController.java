package com.felipe.minicontadigital.controller;

import com.felipe.minicontadigital.entity.Conta;
import com.felipe.minicontadigital.service.ContaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contas")
public class ContaController {

    private final ContaService contaService;

    public ContaController(ContaService contaService) {
        this.contaService = contaService;
    }

   
    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<Conta> criarConta(@PathVariable Long usuarioId,
            Authentication auth) {

        Conta conta = contaService.criarContaParaUsuario(usuarioId);

        return ResponseEntity.ok(conta);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Conta> buscarContaPorId(@PathVariable Long id, Authentication auth) {

        Conta conta = contaService.buscarPorId(id);

        return ResponseEntity.ok(conta);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Conta> buscarPorUsuarioId(@PathVariable Long usuarioId, Authentication auth) {
        Conta conta = contaService.buscarPorUsuarioId(usuarioId);
        
        return ResponseEntity.ok(conta);
    }

    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<java.util.List<Conta>> listarTodas() {
        return ResponseEntity.ok(contaService.listarTodas());
    }

}
