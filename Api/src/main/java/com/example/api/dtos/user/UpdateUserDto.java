package com.example.api.dtos.user;

import com.example.api.entities.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@AllArgsConstructor
@Getter
@Setter
@Builder
public class UpdateUserDto {

    private String name;

    private String email;

    private String phoneNumber;

    private String address;

    private String status;

    private Set<UserRole> roles;
}
