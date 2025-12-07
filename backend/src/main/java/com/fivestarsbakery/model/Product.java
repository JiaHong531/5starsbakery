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

    // Constructor
    public Product(int id, String name, String description, String ingredients, double price, int stock, String category, String imageUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.ingredients = ingredients;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.imageUrl = imageUrl;
    }

    // Note: GSON library reads these private fields automatically,
    // so you don't strictly need Getters/Setters for JSON to work,
    // but it is good practice to generate them if you use them elsewhere.
}