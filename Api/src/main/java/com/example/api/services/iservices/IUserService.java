package com.example.api.services.iservices;

import com.example.api.dtos.authentication.BearerToken;
import com.example.api.dtos.authentication.LoginDto;
import com.example.api.dtos.authentication.RegisterDto;
import com.example.api.dtos.user.UpdateUserDto;
import com.example.api.entities.Users;
import org.springframework.data.domain.Page;

import java.util.Optional;

public interface IUserService {

    Users register (RegisterDto registerDto) throws Exception;

    BearerToken authenticate(LoginDto loginDto) throws Exception;

    Users findUserByEmail(String userEmail) throws Exception;

    Users updateUserByEmail(UpdateUserDto updateUserDto, String userEmail) throws Exception;

    void deleteUserByEmail(String userEmail) throws Exception;

    Page<Users> getAllUser(int page, int size, String sortField, Boolean sortDirection);
}
