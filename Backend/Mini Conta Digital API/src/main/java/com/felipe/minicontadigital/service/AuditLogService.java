package com.felipe.minicontadigital.service;

import com.felipe.minicontadigital.entity.AuditLog;
import com.felipe.minicontadigital.entity.Usuario;
import com.felipe.minicontadigital.repository.AuditLogRepository;
import com.felipe.minicontadigital.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UsuarioRepository usuarioRepository;

    public AuditLogService(AuditLogRepository auditLogRepository,
            UsuarioRepository usuarioRepository) {
        this.auditLogRepository = auditLogRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public void registrar(String usuarioEmail, String endpoint, Object payload) {
        registrar(usuarioEmail, endpoint, payload, null);
    }

    public void registrar(String usuarioEmail, String endpoint, Object payload, String extra) {

        String payloadStr = payload != null ? String.valueOf(payload) : null;

        Usuario usuario = null;
        if (usuarioEmail != null && !usuarioEmail.equals("anonymous")) {
            usuario = usuarioRepository.findByEmail(usuarioEmail).orElse(null);
        }

        AuditLog log = AuditLog.builder()
                .usuario(usuario)
                .usuarioEmail(usuarioEmail)
                .endpoint(endpoint)
                .timestamp(LocalDateTime.now())
                .payload(payloadStr)
                .build();

        auditLogRepository.save(log);

        
        String extraStr = (extra != null && !extra.isBlank()) ? (" extra=" + extra) : "";
        System.out.printf("[AUDIT] ts=%s user=%s endpoint=%s%s payload=%s%n",
                log.getTimestamp(), usuarioEmail, endpoint, extraStr, payloadStr);
    }
}
