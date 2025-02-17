package com.example.demo.service.impl;

import com.example.demo.dto.request.DiaChiDto;
import com.example.demo.dto.request.UserDto;
import com.example.demo.entity.DiaChiEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.entity.UserRoleEntity;
import com.example.demo.repository.DiaChiRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.UserRoleRepository;
import com.example.demo.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsersServiceImpl implements UsersService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private UserRoleRepository userRoleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private DiaChiRepository diaChiRepository;
    @Override
    public List<UserDto> getAll() {
        return userRepository.findAll().stream().map(user -> {
            List<String> roleNames = user.getUserRoleEntities()
                    .stream()
                    .map(userRole -> userRole.getRoleEntity().getTen())
                    .collect(Collectors.toList());
            List<DiaChiDto> diaChiDtos = user.getDiaChiEntities()
                    .stream()
                    .map(diaChi -> new DiaChiDto(
                            diaChi.getId(),
                            diaChi.getXa(),
                            diaChi.getHuyen(),
                            diaChi.getThanhPho(),
                            diaChi.getTenNguoiNhan(),
                            diaChi.getTenDiaChi(),
                            diaChi.getSdtNguoiNhan(),
                            diaChi.getTrangThai(),
                            diaChi.getUserEntity()
                    ))
                    .collect(Collectors.toList());
            return new UserDto(
                    user.getId(),
                    user.getAnh(),
                    user.getHoTen(),
                    user.getNgaySinh(),
                    user.getSoDienThoai(),
                    user.getEmail(),
                    user.getMatKhau(),
                    user.getIsEnabled(),
                    roleNames,
                    diaChiDtos

            );
        }).collect(Collectors.toList());
    }

    @Override
    public UserEntity add(UserDto userDto) {
        UserEntity userEntity = new UserEntity();
        userEntity.setAnh(userDto.getAnh());
        userEntity.setHoTen(userDto.getHoTen());
        userEntity.setNgaySinh(userDto.getNgaySinh());
        userEntity.setSoDienThoai(userDto.getSoDienThoai());
        userEntity.setEmail(userDto.getEmail());
        userEntity.setMatKhau(passwordEncoder.encode(userDto.getMatKhau()));
        userEntity.setIsEnabled(userDto.getIsEnabled());
        UserEntity savedUser = userRepository.save(userEntity);
        // them role vao user
        if (userDto.getRoleNames() != null && !userDto.getRoleNames().isEmpty()) {
            List<UserRoleEntity> userRoles = userDto.getRoleNames().stream()
                    .map(roleName -> roleRepository.findByTen(roleName).orElse(null))
                    .filter(role -> role != null)
                    .map(role -> new UserRoleEntity(savedUser, role))
                    .collect(Collectors.toList());
            userRoleRepository.saveAll(userRoles);
        }
        if (userDto.getDiaChi() != null && !userDto.getDiaChi().isEmpty()){
            List<DiaChiEntity> diaChiEntities = userDto.getDiaChi().stream().map(diaChiDto -> {
                DiaChiEntity diaChiEntity = new DiaChiEntity();
                diaChiEntity.setXa(diaChiDto.getXa());
                diaChiEntity.setHuyen(diaChiDto.getHuyen());
                diaChiEntity.setThanhPho(diaChiDto.getThanhPho());
                diaChiEntity.setUserEntity(savedUser);
                return diaChiEntity;
            }).collect(Collectors.toList());
            diaChiRepository.saveAll(diaChiEntities);
        }

        return savedUser;
    }

    @Override
    @Transactional
    public UserEntity update(UserDto userDto) {
        Optional<UserEntity> optional = userRepository.findById(userDto.getId());
        return optional.map(o ->{
            o.setAnh(userDto.getAnh());
            o.setHoTen(userDto.getHoTen());
            o.setNgaySinh(userDto.getNgaySinh());
            o.setSoDienThoai(userDto.getSoDienThoai());
            o.setEmail(userDto.getEmail());
            o.setMatKhau(userDto.getMatKhau());
            o.setIsEnabled(userDto.getIsEnabled());
            // update role user
            userRoleRepository.deleteByUserEntityId(o.getId());
            if(userDto.getRoleNames() != null && !userDto.getRoleNames().isEmpty()){
                List<UserRoleEntity> userRoleEntities = userDto.getRoleNames().stream()
                        .map(roleName -> roleRepository.findByTen(roleName).orElse(null))
                        .filter(role -> role !=null)
                        .map(role -> new UserRoleEntity(o,role))
                        .collect(Collectors.toList());
                userRoleRepository.saveAll(userRoleEntities);
            }
            // update dia chi
            diaChiRepository.deleteByUserEntityId(o.getId());
            if (userDto.getDiaChi() != null && !userDto.getDiaChi().isEmpty()){
                List<DiaChiEntity> diaChiEntities = userDto.getDiaChi().stream().map(diaChiDto ->{
                    DiaChiEntity diaChiEntity = new DiaChiEntity();
                    diaChiEntity.setXa(diaChiDto.getXa());
                    diaChiEntity.setHuyen(diaChiDto.getHuyen());
                    diaChiEntity.setThanhPho(diaChiDto.getThanhPho());
                    diaChiEntity.setUserEntity(o);
                    return diaChiEntity;
                }).collect(Collectors.toList());
                diaChiRepository.saveAll(diaChiEntities);
            }
            return userRepository.save(o);
        }).orElse(null);
    }

    @Override
    @Transactional
    public UserEntity delete(UserDto userDto) {
        Optional<UserEntity> optional = userRepository.findById(userDto.getId());
        return optional.map(o ->{
            userRoleRepository.deleteByUserEntityId(o.getId());
            userRepository.delete(o);
            return o;
        }).orElse(null);
    }

    @Override
    public UserEntity detail(UserDto userDto) {
        Optional<UserEntity> optional = userRepository.findById(userDto.getId());
        return optional.orElse(null);
    }
}
