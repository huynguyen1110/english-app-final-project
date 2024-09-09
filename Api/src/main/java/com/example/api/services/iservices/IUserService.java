package com.example.api.services.iservices;

import com.example.api.dtos.authentication.BearerToken;
import com.example.api.dtos.authentication.LoginDto;
import com.example.api.dtos.authentication.RegisterDto;
import com.example.api.entities.Users;

import java.util.Optional;

public interface IUserService {

    Users register (RegisterDto registerDto) throws Exception;

    BearerToken authenticate(LoginDto loginDto) throws Exception;

    Users findUserByEmail(String userEmail) throws Exception;

    Users updateUserByEmail(RegisterDto updateUserDto, String userEmail) throws Exception;

    void deleteUserByEmail(String userEmail) throws Exception;
}
