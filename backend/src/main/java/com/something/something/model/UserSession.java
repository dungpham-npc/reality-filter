package com.something.something.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_sessions")
public class UserSession {

    @Id
    @Column(columnDefinition = "UUID")
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Phase currentPhase;

    private Instant createdAt;
    private Instant hazardAcceptedAt;
    private Instant codeSubmittedAt;
    private Instant failureRevealedAt;
    private Instant forkReachedAt;
    private Instant exitedAt;

    @Enumerated(EnumType.STRING)
    private Phase quitPhase;

    public UserSession() {
    }

    public UserSession(UUID id) {
        this.id = id;
        this.currentPhase = Phase.HAZARD_WARNING;
        this.createdAt = Instant.now();
    }

    // Getters and setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Phase getCurrentPhase() {
        return currentPhase;
    }

    public void setCurrentPhase(Phase currentPhase) {
        this.currentPhase = currentPhase;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getHazardAcceptedAt() {
        return hazardAcceptedAt;
    }

    public void setHazardAcceptedAt(Instant hazardAcceptedAt) {
        this.hazardAcceptedAt = hazardAcceptedAt;
    }

    public Instant getCodeSubmittedAt() {
        return codeSubmittedAt;
    }

    public void setCodeSubmittedAt(Instant codeSubmittedAt) {
        this.codeSubmittedAt = codeSubmittedAt;
    }

    public Instant getFailureRevealedAt() {
        return failureRevealedAt;
    }

    public void setFailureRevealedAt(Instant failureRevealedAt) {
        this.failureRevealedAt = failureRevealedAt;
    }

    public Instant getForkReachedAt() {
        return forkReachedAt;
    }

    public void setForkReachedAt(Instant forkReachedAt) {
        this.forkReachedAt = forkReachedAt;
    }

    public Instant getExitedAt() {
        return exitedAt;
    }

    public void setExitedAt(Instant exitedAt) {
        this.exitedAt = exitedAt;
    }

    public Phase getQuitPhase() {
        return quitPhase;
    }

    public void setQuitPhase(Phase quitPhase) {
        this.quitPhase = quitPhase;
    }
}
