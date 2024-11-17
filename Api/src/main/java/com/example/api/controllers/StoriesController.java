package com.example.api.controllers;

import com.example.api.dtos.stories.StoriesDto;
import com.example.api.entities.Stories;
import com.example.api.services.impservices.StoriesService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/stories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StoriesController {

    @Autowired
    private final StoriesService storiesService;

    @PostMapping("/create")
    public ResponseEntity<?> createStory(@RequestBody StoriesDto storiesDto) {
        try {
            var response = storiesService.createStory(storiesDto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateStory(@RequestBody StoriesDto storiesDto, @RequestParam Long id) {
        try {
            var response = storiesService.updateStory(id, storiesDto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/get-story")
    public ResponseEntity<?> getStory(@RequestParam Long id) {
        try {
            var response = storiesService.getStoryById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/delete")
    public ResponseEntity<?> deleteStory(@RequestParam Long id) {
        try {
            storiesService.softDeleteStory(id);
            return ResponseEntity.ok("Deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/get-all")
    public ResponseEntity<?> getStories(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "vnTitle") String sortBy,
            @RequestParam(required = false) Boolean direction) {
        try {
            var response = storiesService.getAllStories(page - 1, size, sortBy, direction);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/set-is-read")
    public ResponseEntity<?> setIsReadStory(@RequestParam String userEmail, @RequestParam Long storyId) {
        try {
            storiesService.setIsReadStory(userEmail, storyId);
            return ResponseEntity.ok("set successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/finished")
    public ResponseEntity<?> getFinishedStories(@RequestParam String userEmail) {
        try {
            Optional<List<Stories>> stories = storiesService.getFinishedStoriesByUserId(userEmail);

            // Trả về danh sách truyện nếu tồn tại
            return ResponseEntity.ok(stories.orElseThrow());
        } catch (Exception e) {
            // Trả về thông báo lỗi nếu không tìm thấy
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}

