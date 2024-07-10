package com.example.api.controllers;

import com.example.api.dtos.words.WordDto;
import com.example.api.services.impservices.WordSerivce;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/word")
@RequiredArgsConstructor
public class WordController {

    @Autowired
    private final WordSerivce wordSerivce;

    @PostMapping("/create")
    public ResponseEntity<?> createWord(@RequestBody WordDto wordDto) {
        try {
            var response = wordSerivce.createWord(wordDto);
            return  ResponseEntity.ok(response);
        } catch (Exception erException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erException.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateword(@RequestBody WordDto wordDto, @RequestParam(required = true) Long id) {
        try {
            var response = wordSerivce.updateWord(wordDto, id);
            return  ResponseEntity.ok(response);
        } catch (Exception erException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erException.getMessage());
        }
    }

    @PutMapping("/delete")
    public ResponseEntity<?> updateword(@RequestParam(required = true) Long id) {
        try {
            wordSerivce.deleteWord(id);
            return  ResponseEntity.ok("Deleted successfully word with id: " + id);
        } catch (Exception erException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erException.getMessage());
        }
    }

    @GetMapping("/get-all")
    public ResponseEntity<?> getWords(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(required = false) Boolean direction) {
        try {
            var response = wordSerivce.getAllWords(page -1, size, sortBy, direction);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/add-word-to-package")
    public ResponseEntity<?> addWordToPackage(
            @RequestParam Long wordId, @RequestParam Long packageId) {
        try {
            wordSerivce.addwordToPackage(wordId, packageId);
            return ResponseEntity.ok("added word to package");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/remove-word-from-package")
    public ResponseEntity<?> removeWordFromPackage(
            @RequestParam Long wordId, @RequestParam Long packageId) {
        try {
            wordSerivce.removeWordFromPackage(wordId, packageId);
            return ResponseEntity.ok("removed word to package");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
