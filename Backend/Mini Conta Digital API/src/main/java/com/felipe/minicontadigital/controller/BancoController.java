package com.felipe.minicontadigital.controller;

import com.felipe.minicontadigital.dto.BancoResponse;
import com.felipe.minicontadigital.service.BancoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bancos")
public class BancoController {

    private final BancoService bancoService;

    public BancoController(BancoService bancoService) {
        this.bancoService = bancoService;
    }

    @GetMapping
    public ResponseEntity<List<BancoResponse>> listarTodos() {
        return ResponseEntity.ok(bancoService.listarBancos());
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<BancoResponse> buscarPorCodigo(@PathVariable Integer codigo) {
        return bancoService.buscarPorCodigo(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
