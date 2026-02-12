package com.something.something.service;

import com.something.something.model.Task;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class TaskService {

    private final List<Task> tasks = new ArrayList<>();
    private final Map<String, Task> tasksById = new LinkedHashMap<>();

    @PostConstruct
    public void loadTasks() throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] resources = resolver.getResources("classpath:tasks/*.md");

        Arrays.sort(resources, Comparator.comparing(Resource::getFilename));

        for (Resource resource : resources) {
            String filename = resource.getFilename();
            if (filename == null)
                continue;

            String content = resource.getContentAsString(StandardCharsets.UTF_8);
            String id = filename.replace(".md", "");

            String title = "";
            String description = "";
            String starterCode = "";
            String body = content;

            // Parse front matter
            if (content.startsWith("---")) {
                int endIndex = content.indexOf("---", 3);
                if (endIndex > 0) {
                    String frontMatter = content.substring(3, endIndex).trim();
                    body = content.substring(endIndex + 3).trim();

                    for (String line : frontMatter.split("\n")) {
                        line = line.trim();
                        if (line.startsWith("title:")) {
                            title = line.substring(6).trim();
                        }
                    }
                }
            }

            // Split body into description and starter code at ```js marker
            int codeStart = body.indexOf("```js");
            if (codeStart < 0)
                codeStart = body.indexOf("```javascript");

            if (codeStart >= 0) {
                description = body.substring(0, codeStart).trim();
                int codeContentStart = body.indexOf("\n", codeStart) + 1;
                int codeEnd = body.indexOf("```", codeContentStart);
                if (codeEnd > codeContentStart) {
                    starterCode = body.substring(codeContentStart, codeEnd).trim();
                }
            } else {
                description = body;
            }

            Task task = new Task(id, title, description, starterCode);
            tasks.add(task);
            tasksById.put(id, task);
        }
    }

    public List<Task> getAllTasks() {
        return Collections.unmodifiableList(tasks);
    }

    public Optional<Task> getTask(String id) {
        return Optional.ofNullable(tasksById.get(id));
    }
}
