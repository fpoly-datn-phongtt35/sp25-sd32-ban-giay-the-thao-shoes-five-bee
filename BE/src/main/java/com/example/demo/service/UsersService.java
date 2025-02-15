package com.example.demo.service;

import com.example.demo.dto.request.UserDto;
import com.example.demo.entity.UserEntity;

import java.util.List;

public interface UsersService {
    List<UserDto> getAll();
    UserEntity add (UserDto userDto);
    UserEntity update(UserDto userDto);
    UserEntity delete(UserDto userDto);
    UserEntity detail(UserDto userDto);
}
