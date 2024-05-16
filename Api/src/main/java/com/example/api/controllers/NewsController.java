package com.example.api.controllers;

import com.example.api.services.impservices.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/news")
@RequiredArgsConstructor
public class NewsController {

    @Autowired
    private NewsService newsService;

    // Search through millions of articles from over 150,000 large and small news sources and blogs.
    //This endpoint suits article discovery and analysis.
    @GetMapping("/get-everything")
    public ResponseEntity<?> getAllNews(@RequestParam String domains, @RequestParam(defaultValue = "") String keyWord) {
        try {
            var response = newsService.getAllNews(domains, keyWord);
            return ResponseEntity.ok(response);
        } catch (Exception erException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erException.getMessage());
        }
    }

    @GetMapping("/get-by-category")
    public ResponseEntity<?> getNewsByCategory(@RequestParam(defaultValue = "") String category
            , @RequestParam(defaultValue = "") String keyWord
            , @RequestParam(defaultValue = "") String sources) {
        try {
            var response = newsService.getNewsByCategory(category, keyWord, sources);
            return ResponseEntity.ok(response);
        } catch (Exception erException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erException.getMessage());
        }
    }
}
