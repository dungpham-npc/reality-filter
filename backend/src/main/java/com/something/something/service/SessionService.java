package com.something.something.service;

import com.something.something.model.Phase;
import com.something.something.model.UserSession;
import com.something.something.repository.UserSessionRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class SessionService {

    private final UserSessionRepository repository;

    public SessionService(UserSessionRepository repository) {
        this.repository = repository;
    }

    public UserSession createSession() {
        UserSession session = new UserSession(UUID.randomUUID());
        return repository.save(session);
    }

    public UserSession getSession(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + id));
    }

    public UserSession advancePhase(UUID id) {
        UserSession session = getSession(id);
        Phase current = session.getCurrentPhase();
        Phase next = current.next();

        if (current == next) {
            throw new IllegalStateException("Cannot advance from terminal phase: " + current);
        }

        Instant now = Instant.now();

        switch (next) {
            case COMFORT_BAIT -> session.setHazardAcceptedAt(now);
            case HIDDEN_FAILURE -> session.setCodeSubmittedAt(now);
            case REVEAL -> session.setFailureRevealedAt(now);
            case FORK -> session.setForkReachedAt(now);
            default -> {
            }
        }

        session.setCurrentPhase(next);
        return repository.save(session);
    }

    public UserSession markExited(UUID id) {
        UserSession session = getSession(id);
        session.setQuitPhase(session.getCurrentPhase());
        session.setCurrentPhase(Phase.EXITED);
        session.setExitedAt(Instant.now());
        return repository.save(session);
    }
}
