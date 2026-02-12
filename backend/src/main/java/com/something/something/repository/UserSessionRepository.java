package com.something.something.repository;

import com.something.something.model.Phase;
import com.something.something.model.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, UUID> {

    long countByCurrentPhase(Phase phase);

    long countByQuitPhaseIsNotNull();

    @Query("SELECT COUNT(s) FROM UserSession s WHERE s.exitedAt IS NOT NULL")
    long countExited();
}
