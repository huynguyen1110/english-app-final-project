package com.example.api.controllers;

import com.example.api.dtos.news.NewsDto;
import com.example.api.services.impservices.FavoriteService;
import com.example.api.services.impservices.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/favorite")
@RequiredArgsConstructor
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @PostMapping("/add-news")
    public ResponseEntity<?> addNewsToFavorite(@RequestParam String userEmail, @RequestParam Long newsId) {
        try {
            favoriteService.addNewsToFavorite(userEmail, newsId);
            return ResponseEntity.ok("added successfully");
        } catch (Exception erException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erException.getMessage());
        }
    }
}
