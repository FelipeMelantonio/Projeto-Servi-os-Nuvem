package com.felipe.minicontadigital.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<?> handleApi(ApiException e) {
        return ResponseEntity.status(e.getStatus()).body(
                Map.of(
                        "erro", e.getMessage(),
                        "status", e.getStatus().value(),
                        "timestamp", LocalDateTime.now().toString()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneral(Exception e) {
        return ResponseEntity.status(500).body(
                Map.of(
                        "erro", "Erro interno do servidor",
                        "detalhe", e.getMessage(),
                        "timestamp", LocalDateTime.now().toString()));
    }
}
