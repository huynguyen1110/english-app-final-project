package com.example.api.dtos.authentication;

import com.example.api.entities.enums.UserRole;
import lombok.*;

import java.util.Set;

@AllArgsConstructor
@Getter
@Setter
@Builder
public class RegisterDto {

    private String name;

    private String password;

    private String email;

    private String phoneNumber;

    private String address;

    private String status;

    private Set<UserRole> roles;
}
