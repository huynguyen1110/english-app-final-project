package com.example.api.controllers;

import com.example.api.dtos.news.NewsDto;
import com.example.api.services.impservices.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/news")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
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

    // no-use
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

    @PostMapping("/create")
    public ResponseEntity<?> createNews(@RequestBody NewsDto newsDto) {
        try {
            newsService.createNews(newsDto);
            return ResponseEntity.ok("Add news successfully");
        } catch (Exception erException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erException.getMessage());
        }
    }

    @GetMapping("/get-news")
    public ResponseEntity<?> getNewsFromDatabase(@RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "10") int size,
                                                 @RequestParam(defaultValue = "title") String sortField,
                                                 @RequestParam(required = false) Boolean sortDirection,
                                                 @RequestParam(required = false) Long topicId) {
        try {
            var response = newsService.getNewsFromDatabase(page - 1, size, sortField, sortDirection, topicId);
            return ResponseEntity.ok(response);
        } catch (Exception erException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erException.getMessage());
        }
    }

    @GetMapping("/get-news-source-name")
    public ResponseEntity<?> getNewsFromDatabaseGroupBySourceName(@RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "10") int size,
                                                 @RequestParam(defaultValue = "title") String sortField,
                                                 @RequestParam(required = false) Boolean sortDirection,
                                                 @RequestParam(required = true) String sourceName) {
        try {
            var response = newsService.getNewsFromDatabaseGroupBySourceName(page - 1, size, sortField, sortDirection, sourceName);
            return ResponseEntity.ok(response);
        } catch (Exception erException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erException.getMessage());
        }
    }


    @GetMapping("/get-news-id")
    public ResponseEntity<?> getNewsById(@RequestParam Long newsId) {
        try {
            var news = newsService.getNewsById(newsId);
            return ResponseEntity.ok(news);
        } catch (Exception erException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erException.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateNews(@RequestParam long newsId, @RequestBody NewsDto newsDto) {
        try {
            newsService.updateNews(newsDto, newsId);
            return ResponseEntity.ok("Updated successfully");
        } catch (Exception erException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erException.getMessage());
        }
    }

    @PutMapping("/delete")
    public ResponseEntity<?> deleteNews(@RequestParam long id) {
        try {
            newsService.deleteNews(id);
            return ResponseEntity.ok("deleted successfully");
        } catch (Exception erException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erException.getMessage());
        }
    }
}
