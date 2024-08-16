package com.example.api.controllers;

import com.example.api.dtos.authentication.RegisterDto;
import com.example.api.dtos.topic.TopicDto;
import com.example.api.services.impservices.NewsService;
import com.example.api.services.impservices.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/topic")
@RequiredArgsConstructor
public class TopicController {

    @Autowired
    private final TopicService topicService;

    @GetMapping("/get-all")
    public ResponseEntity<?> getAllTopics(@RequestParam(defaultValue = "1") int page,
                                          @RequestParam(defaultValue = "10") int size) {
        try {
            var respone = topicService.getAllTopics(page - 1, size);
            return ResponseEntity.ok(respone);
        } catch (Exception erException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erException.getMessage());
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createTopic(@RequestBody TopicDto topicDto) {
        try {
            var respone = topicService.createTopic(topicDto);
            return ResponseEntity.ok(respone);
        } catch (Exception erException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erException.getMessage());
        }
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateTopic(@RequestBody TopicDto topicDto, @RequestParam Long id) {
        try {
            var respone = topicService.updateTopic(id, topicDto);
            return ResponseEntity.ok(respone);
        } catch (Exception erException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erException.getMessage());
        }
    }

    @PutMapping("/delete")
    public ResponseEntity<?> deleteTopic(@RequestParam Long id) {
        try {
            topicService.deleteTopic(id);
            return ResponseEntity.ok("Delete successfully");
        } catch (Exception erException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erException.getMessage());
        }
    }
}
