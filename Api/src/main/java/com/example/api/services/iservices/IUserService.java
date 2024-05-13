package com.example.api.services.iservices;

import com.example.api.dtos.BearerToken;
import com.example.api.dtos.LoginDto;
import com.example.api.dtos.RegisterDto;
import com.example.api.entities.Users;
import org.springframework.http.ResponseEntity;

public interface IUserService {

    Users register (RegisterDto registerDto) throws Exception;

    BearerToken authenticate(LoginDto loginDto) throws Exception;
}
