package com.fivestarsbakery.model;

public class Category {
    private int categoryId;
    private String name;
    private String displayName;
    private String iconUrl;

    public Category() {}

    public Category(int categoryId, String name, String displayName, String iconUrl) {
        this.categoryId = categoryId;
        this.name = name;
        this.displayName = displayName;
        this.iconUrl = iconUrl;
    }

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }
}
