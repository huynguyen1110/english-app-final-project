package com.example.api.services.impservices;

import com.example.api.config.JwtUtilities;
import com.example.api.dtos.authentication.BearerToken;
import com.example.api.dtos.authentication.LoginDto;
import com.example.api.dtos.authentication.RegisterDto;
import com.example.api.dtos.user.UpdateUserDto;
import com.example.api.entities.Favorites;
import com.example.api.entities.News;
import com.example.api.entities.Users;
import com.example.api.entities.enums.UserRole;
import com.example.api.entities.enums.UserStatus;
import com.example.api.repositories.FavoriteRepository;
import com.example.api.repositories.UserRepository;
import com.example.api.services.iservices.IUserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.*;

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
                    .address(registerDto.getAddress())
                    .password(passwordEncoder.encode(registerDto.getPassword()))
                    .roles(registerDto.getRoles())
                    .userStatus(UserStatus.valueOf(registerDto.getStatus()))
                    .favorite(favorites)
                    .createdDate(LocalDateTime.now())
                    .build();

            if (UserStatus.valueOf(registerDto.getStatus()).equals(UserStatus.IS_DELETED)) {
                user.setIsDeleted(true);
            } else {
                user.setIsDeleted(false);
            }

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
        if (user.getIsDeleted()) {
            throw new Exception("The user no longer exists");
        }
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

    private void updateUserDetails(Users user, UpdateUserDto updateUserDto) {
        user.setUsername(updateUserDto.getName());
        user.setEmail(updateUserDto.getEmail());
        user.setPhoneNumber(updateUserDto.getPhoneNumber());
        user.setAddress(updateUserDto.getAddress());
        user.setUserStatus(UserStatus.valueOf(updateUserDto.getStatus()));
        user.setRoles(updateUserDto.getRoles());
        user.setUpdatedDate(LocalDateTime.now());

        if (UserStatus.valueOf(updateUserDto.getStatus()).equals(UserStatus.IS_DELETED)) {
            user.setIsDeleted(true);
            user.setDeletedAt(LocalDateTime.now());
        } else {
            user.setIsDeleted(false);
            user.setDeletedAt(null);
        }
    }

    @Override
    public Users updateUserByEmail(UpdateUserDto updateUserDto, String userEmail) throws Exception {
        Users user = findUserByEmail(userEmail);

        if (!user.getEmail().equals(userEmail)) {
            if (userRepository.existsByEmail(updateUserDto.getEmail())) {
                throw new IllegalArgumentException("Email is already taken");
            }
        }

        updateUserDetails(user, updateUserDto);
        userRepository.save(user);
        return user;
    }

    @Override
    public void deleteUserByEmail(String userEmail) throws Exception {
        Users user = findUserByEmail(userEmail);
        user.setIsDeleted(true);
        user.setUserStatus(UserStatus.IS_DELETED);
        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Override
    public Page<Users> getAllUser(int page, int size, String sortField, Boolean sortDirection) {
        boolean isValidField = Arrays.stream(Users.class.getDeclaredFields())
                .map(Field::getName)
                .anyMatch(fieldName -> fieldName.equals(sortField));

        if (!isValidField) {
            throw new IllegalArgumentException("Invalid sortField: " + sortField);
        }

        // If sortDirection == true then sort in ascending order, if false then sort in descending order
        Sort.Direction direction = (sortDirection != null && sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sort = Sort.by(direction, sortField);
        Pageable pageable = PageRequest.of(page, size, sort);
        return userRepository.getAllUser(pageable);
    }
}
