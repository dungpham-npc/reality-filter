package com.something.something.model;

public class Reading {

    private String id;
    private String title;
    private String summary;
    private String markdownContent;
    private String category;

    public Reading() {
    }

    public Reading(String id, String title, String summary, String markdownContent, String category) {
        this.id = id;
        this.title = title;
        this.summary = summary;
        this.markdownContent = markdownContent;
        this.category = category;
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

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getMarkdownContent() {
        return markdownContent;
    }

    public void setMarkdownContent(String markdownContent) {
        this.markdownContent = markdownContent;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
