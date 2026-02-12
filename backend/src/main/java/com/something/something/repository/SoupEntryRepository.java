package com.something.something.repository;

import com.something.something.model.SoupEntry;
import com.something.something.model.SoupStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SoupEntryRepository extends JpaRepository<SoupEntry, UUID> {

    List<SoupEntry> findByStatusOrderByCreatedAtDesc(SoupStatus status);

    Optional<SoupEntry> findBySlug(String slug);

    boolean existsBySlug(String slug);
}
