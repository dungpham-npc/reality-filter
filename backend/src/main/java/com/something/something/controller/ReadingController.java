package com.something.something.controller;

import com.something.something.model.Phase;
import com.something.something.model.Reading;
import com.something.something.model.UserSession;
import com.something.something.service.ReadingService;
import com.something.something.service.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/readings")
public class ReadingController {

    private final ReadingService readingService;
    private final SessionService sessionService;

    public ReadingController(ReadingService readingService, SessionService sessionService) {
        this.readingService = readingService;
        this.sessionService = sessionService;
    }

    @GetMapping
    public ResponseEntity<?> getAllReadings(@RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        if (!isUnlocked(sessionId)) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", "Readings are locked. You must reach the Fork phase first."));
        }
        List<Reading> readings = readingService.getAllReadings();
        return ResponseEntity.ok(readings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReading(
            @PathVariable String id,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        if (!isUnlocked(sessionId)) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", "Readings are locked."));
        }
        return readingService.getReading(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private boolean isUnlocked(String sessionId) {
        if (sessionId == null || sessionId.isBlank())
            return false;
        try {
            UserSession session = sessionService.getSession(UUID.fromString(sessionId));
            Phase phase = session.getCurrentPhase();
            return phase == Phase.FORK || phase == Phase.READINGS || phase == Phase.EXITED;
        } catch (Exception e) {
            return false;
        }
    }
}
