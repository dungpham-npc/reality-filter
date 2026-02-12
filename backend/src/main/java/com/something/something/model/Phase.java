package com.something.something.model;

public enum Phase {
    HAZARD_WARNING,
    COMFORT_BAIT,
    HIDDEN_FAILURE,
    REVEAL,
    FORK,
    READINGS,
    EXITED;

    public Phase next() {
        return switch (this) {
            case HAZARD_WARNING -> COMFORT_BAIT;
            case COMFORT_BAIT -> HIDDEN_FAILURE;
            case HIDDEN_FAILURE -> REVEAL;
            case REVEAL -> FORK;
            case FORK -> READINGS;
            case READINGS -> READINGS;
            case EXITED -> EXITED;
        };
    }

    public boolean canAdvanceTo(Phase target) {
        return this.next() == target;
    }
}
