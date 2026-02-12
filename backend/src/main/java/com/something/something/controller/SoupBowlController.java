package com.something.something.controller;

import com.something.something.service.SoupEntryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/bowl")
public class SoupBowlController {

    private final SoupEntryService service;
    private final String adminPassword;

    public SoupBowlController(SoupEntryService service,
            @Value("${app.admin.password}") String adminPassword) {
        this.service = service;
        this.adminPassword = adminPassword;
    }

    private boolean isAuthorized(String password) {
        return adminPassword.equals(password);
    }

    // --- CRUD ---

    @GetMapping("/entries")
    public ResponseEntity<?> listEntries(@RequestHeader("X-Admin-Password") String password) {
        if (!isAuthorized(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }
        return ResponseEntity.ok(service.getAllEntries());
    }

    @PostMapping("/entries")
    public ResponseEntity<?> createEntry(@RequestHeader("X-Admin-Password") String password,
            @RequestBody Map<String, String> body) {
        if (!isAuthorized(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }
        try {
            String title = body.get("title");
            String slug = body.get("slug");
            if (title == null || slug == null) {
                return ResponseEntity.badRequest().body("title and slug are required");
            }
            return ResponseEntity.ok(service.createEntry(title, slug));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/entries/{id}")
    public ResponseEntity<?> getEntry(@RequestHeader("X-Admin-Password") String password,
            @PathVariable UUID id) {
        if (!isAuthorized(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }
        try {
            return ResponseEntity.ok(service.getEntry(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/entries/{id}")
    public ResponseEntity<?> deleteEntry(@RequestHeader("X-Admin-Password") String password,
            @PathVariable UUID id) {
        if (!isAuthorized(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }
        try {
            service.deleteEntry(id);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- Phase updates ---

    @PutMapping("/entries/{id}/example")
    public ResponseEntity<?> updateExample(@RequestHeader("X-Admin-Password") String password,
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        if (!isAuthorized(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }
        try {
            return ResponseEntity.ok(service.updateExample(id,
                    body.get("description"),
                    body.get("starterCode"),
                    body.get("testsCode"),
                    body.get("simulationCode")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/entries/{id}/explanation")
    public ResponseEntity<?> updateExplanation(@RequestHeader("X-Admin-Password") String password,
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        if (!isAuthorized(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }
        try {
            return ResponseEntity.ok(service.updateExplanation(id,
                    body.get("assumption"),
                    body.get("invariant"),
                    body.get("machineBehavior")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/entries/{id}/article")
    public ResponseEntity<?> updateArticle(@RequestHeader("X-Admin-Password") String password,
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        if (!isAuthorized(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }
        try {
            return ResponseEntity.ok(service.updateArticle(id, body.get("articleContent")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- Ceremony advancement ---

    @PostMapping("/entries/{id}/advance")
    public ResponseEntity<?> advance(@RequestHeader("X-Admin-Password") String password,
            @PathVariable UUID id) {
        if (!isAuthorized(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }
        try {
            return ResponseEntity.ok(service.advance(id));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/entries/{id}/publish")
    public ResponseEntity<?> publish(@RequestHeader("X-Admin-Password") String password,
            @PathVariable UUID id) {
        if (!isAuthorized(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }
        try {
            return ResponseEntity.ok(service.publish(id));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/entries/{id}/unpublish")
    public ResponseEntity<?> unpublish(@RequestHeader("X-Admin-Password") String password,
            @PathVariable UUID id) {
        if (!isAuthorized(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }
        try {
            return ResponseEntity.ok(service.unpublish(id));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
