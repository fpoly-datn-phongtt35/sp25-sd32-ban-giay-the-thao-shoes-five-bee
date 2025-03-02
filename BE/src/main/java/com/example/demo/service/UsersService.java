package com.example.demo.service;

import com.example.demo.dto.request.UserDto;
import com.example.demo.dto.request.UserDtoSearch;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.UserEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface UsersService {
  String getAuthenticatedUserEmail();

  List<UserEntity> getAll();

  UserEntity add(UserDto userDto, MultipartFile file) throws IOException;

  UserEntity update(UserDto userDto, MultipartFile file) throws IOException;

  UserEntity delete(UserDto userDto);

  UserDto detail(UserDto userDto);

  PageResponse<UserEntity> findByPagingCriteria(UserDtoSearch userDtoSearch, Pageable pageable);

  List<UserEntity> exportExcelByFindJpa(UserDtoSearch userDtoSearch);

  List<UserEntity> importExcel(MultipartFile file) throws IOException;

  List<UserDto> importExcelCheckDuplicate(MultipartFile file) throws IOException;

  UserEntity details(UUID id);
}
