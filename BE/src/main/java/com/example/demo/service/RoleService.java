package com.example.demo.service;

import com.example.demo.dto.request.RoleDto;
import com.example.demo.entity.RoleEntity;

import java.util.List;

public interface RoleService {
    List<RoleEntity> getAll();
    RoleEntity add(RoleDto roleDto);
    RoleEntity update(RoleDto roleDto);
    RoleEntity delete(RoleDto roleDto);
    RoleEntity detail(RoleDto roleDto);
}
