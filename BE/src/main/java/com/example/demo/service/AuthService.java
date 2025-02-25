package com.example.demo.service;

import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.request.SignupRequest;
import com.example.demo.dto.request.UserOtpDto;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<?> login(LoginRequest loginRequest);
    ResponseEntity<?> registerUser(SignupRequest signupRequest , String roleName);
    ResponseEntity<?> registerNhanVien(SignupRequest signupRequest);
    ResponseEntity<?> registerKhachHang(SignupRequest signupRequest);
    ResponseEntity<?> registerStaff(SignupRequest signupRequest);
    Boolean userEmail(String email);
    ResponseEntity<?> checkOtp(UserOtpDto userOtpDto);
    ResponseEntity<?> sendBackOtp(UserOtpDto userOtpDto);
    ResponseEntity<?> logout();
}
