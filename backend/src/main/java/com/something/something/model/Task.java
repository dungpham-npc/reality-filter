package com.something.something.model;

public class Task {

    private String id;
    private String title;
    private String description;
    private String starterCode;

    public Task() {
    }

    public Task(String id, String title, String description, String starterCode) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.starterCode = starterCode;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStarterCode() {
        return starterCode;
    }

    public void setStarterCode(String starterCode) {
        this.starterCode = starterCode;
    }
}
