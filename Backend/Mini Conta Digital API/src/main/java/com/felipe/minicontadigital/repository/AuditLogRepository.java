package com.felipe.minicontadigital.repository;

import com.felipe.minicontadigital.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}
