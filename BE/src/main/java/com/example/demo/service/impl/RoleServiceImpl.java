package com.example.demo.service.impl;

import com.example.demo.dto.request.RoleDto;
import com.example.demo.entity.RoleEntity;
import com.example.demo.repository.RoleRepository;
import com.example.demo.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public List<RoleEntity> getAll() {
        return roleRepository.findAll();
    }

    @Override
    public RoleEntity add(RoleDto roleDto) {
        RoleEntity roleEntity = new RoleEntity();
        roleEntity.setMa(roleDto.getMa());
        roleEntity.setTen(roleDto.getTen());
        roleEntity.setMoTa(roleDto.getMoTa());
        roleEntity.setTrangThai(roleDto.getTrangThai());
        return roleRepository.save(roleEntity);
    }

    @Override
    public RoleEntity update(RoleDto roleDto) {
        Optional<RoleEntity> optional = roleRepository.findById(roleDto.getId());
        return optional.map(o ->{
            o.setMa(roleDto.getMa());
            o.setTen(roleDto.getTen());
            o.setMoTa(roleDto.getMoTa());
            o.setTrangThai(roleDto.getTrangThai());
            return roleRepository.save(o);
        }).orElse(null);
    }

    @Override
    public RoleEntity delete(RoleDto roleDto) {
        Optional<RoleEntity> optional = roleRepository.findById(roleDto.getId());
        return optional.map(o ->{
            roleRepository.delete(o);
            return o;
        }).orElse(null);
    }

    @Override
    public RoleEntity detail(RoleDto roleDto) {
        Optional<RoleEntity> optional = roleRepository.findById(roleDto.getId());
        return optional.orElse(null);
    }
}
