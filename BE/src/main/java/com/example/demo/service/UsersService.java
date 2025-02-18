package com.example.demo.service;

import com.example.demo.dto.request.UserDto;
import com.example.demo.entity.UserEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface UsersService {

  String getAuthenticatedUserEmail();

  List<UserDto> getAll();

  UserEntity add(UserDto userDto, MultipartFile file) throws IOException;

  UserEntity update(UserDto userDto, MultipartFile file) throws IOException;

  UserEntity delete(UserDto userDto);

  UserEntity detail(UserDto userDto);
}
