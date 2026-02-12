package com.something.something.controller;

import com.something.something.model.Phase;
import com.something.something.model.UserSession;
import com.something.something.repository.UserSessionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserSessionRepository repository;

    @Value("${app.admin.password}")
    private String adminPassword;

    public AdminController(UserSessionRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/metrics")
    public ResponseEntity<?> getMetrics(
            @RequestHeader(value = "X-Admin-Password", required = false) String password) {

        if (!adminPassword.equals(password)) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Unauthorized"));
        }

        List<UserSession> allSessions = repository.findAll();
        long totalSessions = allSessions.size();

        Map<String, Long> sessionsByPhase = new LinkedHashMap<>();
        for (Phase phase : Phase.values()) {
            sessionsByPhase.put(phase.name(), repository.countByCurrentPhase(phase));
        }

        Map<String, Long> quitDistribution = new LinkedHashMap<>();
        for (UserSession s : allSessions) {
            if (s.getQuitPhase() != null) {
                quitDistribution.merge(s.getQuitPhase().name(), 1L, Long::sum);
            }
        }

        long completedToFork = allSessions.stream()
                .filter(s -> s.getForkReachedAt() != null)
                .count();

        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("totalSessions", totalSessions);
        metrics.put("sessionsByPhase", sessionsByPhase);
        metrics.put("quitDistribution", quitDistribution);
        metrics.put("completedToFork", completedToFork);
        metrics.put("totalExited", repository.countExited());

        return ResponseEntity.ok(metrics);
    }
}
