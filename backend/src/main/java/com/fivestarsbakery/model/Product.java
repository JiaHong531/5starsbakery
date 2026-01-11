package com.fivestarsbakery.model;

public class Product {
    private int id;
    private String name;
    private String description;
    private String ingredients;
    private double price;
    private int stock;
    private String category;
    private String imageUrl;

    
    public Product(int id, String name, String description, String ingredients, double price, int stock,
            String category, String imageUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.ingredients = ingredients;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.imageUrl = imageUrl;
    }

    
    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getIngredients() {
        return ingredients;
    }

    public double getPrice() {
        return price;
    }

    public int getStock() {
        return stock;
    }

    public String getCategory() {
        return category;
    }

    public String getImageUrl() {
        return imageUrl;
    }
}