package com.example.api.controllers;

import com.example.api.dtos.packages.PackagesDto;
import com.example.api.services.impservices.PackagesService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/package")
@RequiredArgsConstructor
public class PackagesController {

    @Autowired
    private final PackagesService packagesService;

    @PostMapping("/create")
    public ResponseEntity<?> createPackage(@RequestBody PackagesDto packagesDto, @RequestParam(defaultValue = "") String userEmail) {
        try {
            var response = packagesService.createPackage(packagesDto, userEmail);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> udpatePackage(@RequestBody PackagesDto packagesDto, @RequestParam Long id) {
        try {
            var response = packagesService.updatePackage(packagesDto, id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/delete")
    public ResponseEntity<?> deletePackageById(@RequestParam Long id) {
        try {
            packagesService.deletePackageById(id);
            return ResponseEntity.ok("deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/get-all")
    public ResponseEntity<?> getPackages(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(required = false) Boolean direction) {
        try {
            var response = packagesService.getAllPackages(page -1, size, sortBy, direction);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
