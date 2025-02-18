package com.example.demo.service.impl;

import com.example.demo.entity.GioHangEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.repository.GioHangRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.GioHangService;
import com.example.demo.service.UsersService;
import java.util.Date;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GioHangServiceImpl implements GioHangService {
    @Autowired
    private GioHangRepository gioHangRepository;

    @Autowired private UserRepository userRepository;

    @Autowired private UsersService usersService;


}
