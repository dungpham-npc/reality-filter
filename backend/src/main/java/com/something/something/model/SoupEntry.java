package com.something.something.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "soup_entries")
public class SoupEntry {

    @Id
    @Column(columnDefinition = "UUID")
    private UUID id;

    @Column(unique = true, nullable = false)
    private String slug;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SoupStatus status;

    // Phase 1: Example
    @Column(columnDefinition = "TEXT")
    private String exampleDescription;

    @Column(columnDefinition = "TEXT")
    private String exampleStarterCode;

    @Column(columnDefinition = "TEXT")
    private String exampleTestsCode;

    @Column(columnDefinition = "TEXT")
    private String exampleSimulationCode;

    // Phase 2: Explanation
    @Column(columnDefinition = "TEXT")
    private String explanationAssumption;

    @Column(columnDefinition = "TEXT")
    private String explanationInvariant;

    @Column(columnDefinition = "TEXT")
    private String explanationMachineBehavior;

    // Phase 3: Article
    @Column(columnDefinition = "TEXT")
    private String articleContent;

    // Timestamps
    private Instant createdAt;
    private Instant updatedAt;
    private Instant publishedAt;

    public SoupEntry() {
    }

    public static SoupEntry create(String title, String slug) {
        SoupEntry entry = new SoupEntry();
        entry.id = UUID.randomUUID();
        entry.title = title;
        entry.slug = slug;
        entry.status = SoupStatus.DRAFT_EXAMPLE;
        entry.createdAt = Instant.now();
        entry.updatedAt = Instant.now();
        return entry;
    }

    // Getters and setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public SoupStatus getStatus() {
        return status;
    }

    public void setStatus(SoupStatus status) {
        this.status = status;
    }

    public String getExampleDescription() {
        return exampleDescription;
    }

    public void setExampleDescription(String exampleDescription) {
        this.exampleDescription = exampleDescription;
    }

    public String getExampleStarterCode() {
        return exampleStarterCode;
    }

    public void setExampleStarterCode(String exampleStarterCode) {
        this.exampleStarterCode = exampleStarterCode;
    }

    public String getExampleTestsCode() {
        return exampleTestsCode;
    }

    public void setExampleTestsCode(String exampleTestsCode) {
        this.exampleTestsCode = exampleTestsCode;
    }

    public String getExampleSimulationCode() {
        return exampleSimulationCode;
    }

    public void setExampleSimulationCode(String exampleSimulationCode) {
        this.exampleSimulationCode = exampleSimulationCode;
    }

    public String getExplanationAssumption() {
        return explanationAssumption;
    }

    public void setExplanationAssumption(String explanationAssumption) {
        this.explanationAssumption = explanationAssumption;
    }

    public String getExplanationInvariant() {
        return explanationInvariant;
    }

    public void setExplanationInvariant(String explanationInvariant) {
        this.explanationInvariant = explanationInvariant;
    }

    public String getExplanationMachineBehavior() {
        return explanationMachineBehavior;
    }

    public void setExplanationMachineBehavior(String explanationMachineBehavior) {
        this.explanationMachineBehavior = explanationMachineBehavior;
    }

    public String getArticleContent() {
        return articleContent;
    }

    public void setArticleContent(String articleContent) {
        this.articleContent = articleContent;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Instant getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(Instant publishedAt) {
        this.publishedAt = publishedAt;
    }
}
