package com.something.something.model;

public enum SoupStatus {

    DRAFT_EXAMPLE,
    DRAFT_EXPLANATION,
    DRAFT_ARTICLE,
    PUBLISHED;

    public SoupStatus next() {
        return switch (this) {
            case DRAFT_EXAMPLE -> DRAFT_EXPLANATION;
            case DRAFT_EXPLANATION -> DRAFT_ARTICLE;
            case DRAFT_ARTICLE -> PUBLISHED;
            case PUBLISHED -> PUBLISHED;
        };
    }

    public boolean canAdvanceTo(SoupStatus target) {
        return this.next() == target && this != PUBLISHED;
    }
}
