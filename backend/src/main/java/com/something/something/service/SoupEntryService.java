package com.something.something.service;

import com.something.something.model.SoupEntry;
import com.something.something.model.SoupStatus;
import com.something.something.repository.SoupEntryRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class SoupEntryService {

    private final SoupEntryRepository repository;

    public SoupEntryService(SoupEntryRepository repository) {
        this.repository = repository;
    }

    public SoupEntry createEntry(String title, String slug, String description) {
        if (repository.existsBySlug(slug)) {
            throw new IllegalArgumentException("Slug '" + slug + "' already exists");
        }
        SoupEntry entry = SoupEntry.create(title, slug, description);
        return repository.save(entry);
    }

    public SoupEntry getEntry(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Entry not found: " + id));
    }

    public List<SoupEntry> getAllEntries() {
        return repository.findAll();
    }

    public List<SoupEntry> getPublishedEntries() {
        return repository.findByStatusOrderByCreatedAtDesc(SoupStatus.PUBLISHED);
    }

    public SoupEntry getPublishedBySlug(String slug) {
        SoupEntry entry = repository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Entry not found: " + slug));
        if (entry.getStatus() != SoupStatus.PUBLISHED) {
            throw new IllegalStateException("Entry is not published");
        }
        return entry;
    }

    // Phase 1: Example
    public SoupEntry updateExample(UUID id, String description, String starterCode,
            String testsCode, String simulationCode) {
        SoupEntry entry = getEntry(id);
        entry.setExampleDescription(description);
        entry.setExampleStarterCode(starterCode);
        entry.setExampleTestsCode(testsCode);
        entry.setExampleSimulationCode(simulationCode);
        entry.setUpdatedAt(Instant.now());
        return repository.save(entry);
    }

    // Phase 2: Explanation
    public SoupEntry updateExplanation(UUID id, String assumption, String invariant,
            String machineBehavior) {
        SoupEntry entry = getEntry(id);
        if (entry.getStatus().ordinal() < SoupStatus.DRAFT_EXPLANATION.ordinal()) {
            throw new IllegalStateException("Must complete example phase first");
        }
        entry.setExplanationAssumption(assumption);
        entry.setExplanationInvariant(invariant);
        entry.setExplanationMachineBehavior(machineBehavior);
        entry.setUpdatedAt(Instant.now());
        return repository.save(entry);
    }

    // Phase 3: Article
    public SoupEntry updateArticle(UUID id, String articleContent) {
        SoupEntry entry = getEntry(id);
        if (entry.getStatus().ordinal() < SoupStatus.DRAFT_ARTICLE.ordinal()) {
            throw new IllegalStateException("Must complete explanation phase first");
        }
        entry.setArticleContent(articleContent);
        entry.setUpdatedAt(Instant.now());
        return repository.save(entry);
    }

    // Advance ceremony
    public SoupEntry advance(UUID id) {
        SoupEntry entry = getEntry(id);
        SoupStatus current = entry.getStatus();

        // Validate phase requirements before advancing
        switch (current) {
            case DRAFT_EXAMPLE -> {
                if (isBlank(entry.getExampleDescription()) ||
                        isBlank(entry.getExampleStarterCode()) ||
                        isBlank(entry.getExampleTestsCode()) ||
                        isBlank(entry.getExampleSimulationCode())) {
                    throw new IllegalStateException(
                            "All example fields (description, starter code, tests, simulation) must be filled");
                }
            }
            case DRAFT_EXPLANATION -> {
                if (isBlank(entry.getExplanationAssumption()) ||
                        isBlank(entry.getExplanationInvariant()) ||
                        isBlank(entry.getExplanationMachineBehavior())) {
                    throw new IllegalStateException(
                            "All explanation fields (assumption, invariant, machine behavior) must be filled");
                }
            }
            case DRAFT_ARTICLE, PUBLISHED -> {
                throw new IllegalStateException("Cannot advance from " + current);
            }
        }

        entry.setStatus(current.next());
        entry.setUpdatedAt(Instant.now());
        return repository.save(entry);
    }

    // Publish
    public SoupEntry publish(UUID id) {
        SoupEntry entry = getEntry(id);
        if (entry.getStatus() != SoupStatus.DRAFT_ARTICLE) {
            throw new IllegalStateException(
                    "Can only publish from DRAFT_ARTICLE status. Current: " + entry.getStatus());
        }
        // Example + Explanation must exist (Article is optional)
        if (isBlank(entry.getExampleDescription()) || isBlank(entry.getExplanationAssumption())) {
            throw new IllegalStateException("Example and explanation must be complete to publish");
        }
        entry.setStatus(SoupStatus.PUBLISHED);
        entry.setPublishedAt(Instant.now());
        entry.setUpdatedAt(Instant.now());
        return repository.save(entry);
    }

    // Unpublish
    public SoupEntry unpublish(UUID id) {
        SoupEntry entry = getEntry(id);
        if (entry.getStatus() != SoupStatus.PUBLISHED) {
            throw new IllegalStateException("Entry is not published");
        }
        entry.setStatus(SoupStatus.DRAFT_ARTICLE);
        entry.setPublishedAt(null);
        entry.setUpdatedAt(Instant.now());
        return repository.save(entry);
    }

    // Delete
    public void deleteEntry(UUID id) {
        SoupEntry entry = getEntry(id);
        if (entry.getStatus() == SoupStatus.PUBLISHED) {
            throw new IllegalStateException("Cannot delete a published entry. Unpublish first.");
        }
        repository.delete(entry);
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
