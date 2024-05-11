package com.example.api.services.impservices;

import com.example.api.config.JwtUtilities;
import com.example.api.dtos.LoginDto;
import com.example.api.dtos.RegisterDto;
import com.example.api.entities.Users;
import com.example.api.entities.enums.UserRole;
import com.example.api.repositories.UserRepository;
import com.example.api.services.iservices.IUserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Service
@AllArgsConstructor
public class UserService implements IUserService {

    @Autowired
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtilities jwtUtilities;

    private AuthenticationManager authenticationManager;

    @Override
    public Users register(RegisterDto registerDto) throws Exception {
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new Exception("email is already taken");
        } else {
            Users user = Users.builder()
                    .username(registerDto.getName())
                    .email(registerDto.getEmail())
                    .phoneNumber(registerDto.getPhoneNumber())
                    .password(passwordEncoder.encode(registerDto.getPassword()))
                    .roles(Collections.singleton(UserRole.USER)).build();
            userRepository.save(user);
            return user;
        }
    }

    @Override
    public String authenticate(LoginDto loginDto) throws Exception {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getEmail(),
                        loginDto.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        Users user = userRepository.findByEmail(authentication.getName()).orElseThrow(() -> new Exception("User not found"));
        Set<UserRole> rolesNames = user.getRoles();
        Set<String> roles = new HashSet<>();
        for (UserRole role : rolesNames) {
            roles.add(role.name());
        }
        String token = jwtUtilities.generateToken(user.getEmail(), roles);
        return token;
    }
}
