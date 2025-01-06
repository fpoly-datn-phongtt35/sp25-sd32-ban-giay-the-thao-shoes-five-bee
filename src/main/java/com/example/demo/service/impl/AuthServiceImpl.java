package com.example.demo.service.impl;

import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.request.SignupRequest;
import com.example.demo.dto.request.UserOtpDto;
import com.example.demo.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    @Override
    public ResponseEntity<?> login(LoginRequest loginRequest) {
        return null;
    }

    @Override
    public ResponseEntity<?> registerNhanVien(SignupRequest signupRequest) {
        return null;
    }

    @Override
    public ResponseEntity<?> registerKhachHang(SignupRequest signupRequest) {
        return null;
    }

    @Override
    public ResponseEntity<?> registerStaff(SignupRequest signupRequest) {
        return null;
    }

    @Override
    public Boolean userEmail(String email) {
        return null;
    }

    @Override
    public ResponseEntity<?> checkOtp(UserOtpDto userOtpDto) {
        return null;
    }
}
