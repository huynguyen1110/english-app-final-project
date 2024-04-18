package com.example.api.services.impservices;

import com.example.api.config.JwtUtilities;
import com.example.api.dtos.RegisterDto;
import com.example.api.entities.Users;
import com.example.api.entities.enums.UserRole;
import com.example.api.repositories.UserRepository;
import com.example.api.services.iservices.IUserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@AllArgsConstructor
public class UserService implements IUserService {

    @Autowired
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtilities jwtUtilities;

    @Override
    public Users register(RegisterDto registerDto) throws Exception {
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new Exception("email is already taken");
        } else {
            Users user = Users.builder()
                    .email(registerDto.getEmail())
                    .phoneNumber(registerDto.getPhoneNumber())
                    .password(passwordEncoder.encode(registerDto.getPassword()))
                    .roles(Collections.singleton(UserRole.USER)).build();
            userRepository.save(user);
            return user;
        }
    }
}
