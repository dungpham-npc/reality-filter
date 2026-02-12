package com.something.something.controller;

import com.something.something.model.SoupEntry;
import com.something.something.service.SoupEntryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/entries")
public class PublicEntryController {

    private final SoupEntryService service;

    public PublicEntryController(SoupEntryService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listPublished() {
        List<Map<String, Object>> summaries = new ArrayList<>();
        for (SoupEntry entry : service.getPublishedEntries()) {
            Map<String, Object> summary = new LinkedHashMap<>();
            summary.put("slug", entry.getSlug());
            summary.put("title", entry.getTitle());
            summary.put("description", entry.getDescription());
            summary.put("hasArticle", entry.getArticleContent() != null
                    && !entry.getArticleContent().trim().isEmpty());
            summary.put("publishedAt", entry.getPublishedAt());
            summaries.add(summary);
        }
        return ResponseEntity.ok(summaries);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<?> getBySlug(@PathVariable String slug) {
        try {
            SoupEntry entry = service.getPublishedBySlug(slug);
            return ResponseEntity.ok(entry);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
