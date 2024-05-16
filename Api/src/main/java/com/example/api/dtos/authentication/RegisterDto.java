package com.example.api.dtos.authentication;

import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@Builder
public class RegisterDto {

    private String name;

    private String password;

    private String email;

    private String phoneNumber;
}
