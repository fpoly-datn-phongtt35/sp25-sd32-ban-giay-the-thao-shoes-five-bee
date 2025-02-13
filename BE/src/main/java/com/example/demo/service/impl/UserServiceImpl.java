package com.example.demo.service.impl;

import com.example.demo.entity.UserEntity;
import com.example.demo.entity.UserRoleEntity;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.UserRoleRepository;
import com.example.demo.security.CustomUserDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserRoleRepository userRoleRepository;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(()->new UsernameNotFoundException("Nguoi dung hien tai khong co :" + email));
        if(!Boolean.TRUE.equals(userEntity.getIsEnabled())){
            throw new RuntimeException("Tai khoan chua duoc kich hoat");
        }
        List<UserRoleEntity> userRoleEntities = userRoleRepository.findByUserEntity(userEntity);
        List<String> roles = userRoleEntities.stream()
                .map(userRoleEntity -> userRoleEntity.getRoleEntity().getTen())
                .collect(Collectors.toList());
        return new CustomUserDetail(userEntity,roles);
    }
}
