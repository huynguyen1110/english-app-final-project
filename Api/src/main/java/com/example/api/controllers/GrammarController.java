package com.example.api.controllers;

import com.example.api.dtos.grammar.GrammarDto;
import com.example.api.entities.Grammar;
import com.example.api.services.impservices.GrammarService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/grammar")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GrammarController {

    @Autowired
    private final GrammarService grammarService;

    @GetMapping("/get-grammars")
    public ResponseEntity<?> getGrammars(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam String sortField,
            @RequestParam Boolean sortDirection) {
        try {
            Page<Grammar> grammars = grammarService.getGrammars(page - 1, size, sortField, sortDirection);
            return new ResponseEntity<>(grammars, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createGrammar(@RequestBody GrammarDto grammarDto) {
        try {
            return new ResponseEntity<>(grammarService.createGrammar(grammarDto), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateGrammar(@RequestBody GrammarDto grammarDto, @RequestParam Long id) {
        try {
            return new ResponseEntity<>(grammarService.updateGrammar(id, grammarDto), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/delete")
    public ResponseEntity<?> deleteGrammar(@RequestParam Long id) {
        try {
            grammarService.deleteGrammar(id);
            return new ResponseEntity<>("Grammar deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
