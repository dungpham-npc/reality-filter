package com.something.something.service;

import com.something.something.model.Reading;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class ReadingService {

    private final List<Reading> readings = new ArrayList<>();
    private final Map<String, Reading> readingsById = new LinkedHashMap<>();

    @PostConstruct
    public void loadReadings() throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] resources = resolver.getResources("classpath:readings/*.md");

        Arrays.sort(resources, Comparator.comparing(Resource::getFilename));

        for (Resource resource : resources) {
            String filename = resource.getFilename();
            if (filename == null)
                continue;

            String content = resource.getContentAsString(StandardCharsets.UTF_8);
            String id = filename.replace(".md", "");

            // Parse front matter
            String title = "";
            String summary = "";
            String category = "";
            String markdownBody = content;

            if (content.startsWith("---")) {
                int endIndex = content.indexOf("---", 3);
                if (endIndex > 0) {
                    String frontMatter = content.substring(3, endIndex).trim();
                    markdownBody = content.substring(endIndex + 3).trim();

                    for (String line : frontMatter.split("\n")) {
                        line = line.trim();
                        if (line.startsWith("title:")) {
                            title = line.substring(6).trim();
                        } else if (line.startsWith("summary:")) {
                            summary = line.substring(8).trim();
                        } else if (line.startsWith("category:")) {
                            category = line.substring(9).trim();
                        }
                    }
                }
            }

            Reading reading = new Reading(id, title, summary, markdownBody, category);
            readings.add(reading);
            readingsById.put(id, reading);
        }
    }

    public List<Reading> getAllReadings() {
        return Collections.unmodifiableList(readings);
    }

    public Optional<Reading> getReading(String id) {
        return Optional.ofNullable(readingsById.get(id));
    }
}
