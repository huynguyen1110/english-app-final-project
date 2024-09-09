package com.example.api.controllers;

import com.example.api.dtos.authentication.LoginDto;
import com.example.api.dtos.authentication.RegisterDto;
import com.example.api.services.impservices.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDto registerDto) {
        try {
            var respone = userService.register(registerDto);
            return ResponseEntity.ok(respone);
        } catch (Exception erException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erException.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginDto loginDto) {
        try {
            var respone = userService.authenticate(loginDto);
            return ResponseEntity.ok(respone);
        } catch (Exception erException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erException.getMessage());
        }
    }

    @GetMapping("/get-user")
    public ResponseEntity<?> authenticate(@RequestParam String userEmail) {
        try {
            var respone = userService.findUserByEmail(userEmail);
            return ResponseEntity.ok(respone);
        } catch (Exception erException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erException.getMessage());
        }
    }

    @PutMapping("/update-user")
    public ResponseEntity<?> updateUser(@RequestBody RegisterDto updateUserDto, @RequestParam String userEmail) {
        try {
            var respone = userService.updateUserByEmail(updateUserDto, userEmail);
            return ResponseEntity.ok(respone);
        } catch (Exception erException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erException.getMessage());
        }
    }

    @PutMapping("/delete-user")
    public ResponseEntity<?> deleteUserByEmail(@RequestParam String userEmail) {
        try {
            userService.deleteUserByEmail(userEmail);
            return ResponseEntity.ok("Delete user successfully");
        } catch (Exception erException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erException.getMessage());
        }
    }
}
