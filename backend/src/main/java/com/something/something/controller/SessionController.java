package com.something.something.controller;

import com.something.something.model.UserSession;
import com.something.something.service.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping
    public ResponseEntity<UserSession> createSession() {
        UserSession session = sessionService.createSession();
        return ResponseEntity.ok(session);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserSession> getSession(@PathVariable UUID id) {
        try {
            UserSession session = sessionService.getSession(id);
            return ResponseEntity.ok(session);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/advance")
    public ResponseEntity<?> advancePhase(@PathVariable UUID id) {
        try {
            UserSession session = sessionService.advancePhase(id);
            return ResponseEntity.ok(session);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/exit")
    public ResponseEntity<?> exitSession(@PathVariable UUID id) {
        try {
            UserSession session = sessionService.markExited(id);
            return ResponseEntity.ok(session);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
