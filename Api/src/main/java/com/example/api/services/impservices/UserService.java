package com.example.api.services.impservices;

import com.example.api.config.JwtUtilities;
import com.example.api.dtos.authentication.BearerToken;
import com.example.api.dtos.authentication.LoginDto;
import com.example.api.dtos.authentication.RegisterDto;
import com.example.api.entities.Favorites;
import com.example.api.entities.Users;
import com.example.api.entities.enums.UserRole;
import com.example.api.repositories.FavoriteRepository;
import com.example.api.repositories.UserRepository;
import com.example.api.services.iservices.IUserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
public class UserService implements IUserService {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final FavoriteRepository favoriteRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtilities jwtUtilities;

    private AuthenticationManager authenticationManager;

    // handle register
    @Override
    public Users register(RegisterDto registerDto) throws Exception {
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new Exception("email is already taken");
        } else {
            Favorites favorites = new Favorites();
            favoriteRepository.save(favorites);

            Users user = Users.builder()
                    .username(registerDto.getName())
                    .email(registerDto.getEmail())
                    .phoneNumber(registerDto.getPhoneNumber())
                    .password(passwordEncoder.encode(registerDto.getPassword()))
                    .roles(Collections.singleton(UserRole.USER))
                    .favorite(favorites)
                    .build();
            userRepository.save(user);

            return user;
        }
    }

    // handle login, then return token
    @Override
    public BearerToken authenticate(LoginDto loginDto) throws Exception {
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

        BearerToken bearerToken = BearerToken.builder()
                .accessToken(token)
                .tokenType("access token")
                .build();

        return bearerToken;
    }

    @Override
    public Users findUserByEmail(String userEmail) throws Exception {
        Optional<Users> optionalUsers = userRepository.findByEmail(userEmail);
        Users user = optionalUsers.orElseThrow(() -> new Exception("User not found with this email"));
        return user;
    }
}
