package com.example.demo.controller;

import com.example.demo.dto.request.ExitEmailDto;
import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.request.SignupRequest;
import com.example.demo.dto.request.UserOtpDto;
import com.example.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest){
        return authService.registerKhachHang(signupRequest);
    }
    @PostMapping("/signup-admin")
    public ResponseEntity<?> signupAdmin(@RequestBody SignupRequest signupRequest){
        return authService.registerNhanVien(signupRequest);
    }
    @PostMapping("/signup-staff")
    public ResponseEntity<?> signupStaff(@RequestBody SignupRequest signupRequest){
        return authService.registerStaff(signupRequest);
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){
        return authService.login(loginRequest);
    }
    @PostMapping("/check-otp")
    public ResponseEntity<?> checkOtp(@RequestBody UserOtpDto userOtpDto){
        return authService.checkOtp(userOtpDto);
    }
    @PostMapping("/reload-otp")
    public ResponseEntity<?> sendBackOtp(@RequestBody UserOtpDto userOtpDto){
        return authService.sendBackOtp(userOtpDto);
    }
    @PostMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestBody ExitEmailDto exitEmailDto) {
        String email = exitEmailDto.getEmail();
        if (email == null && email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email không được để trống"));
        }
        Boolean exits = authService.userEmail(exitEmailDto.getEmail());
        return ResponseEntity.ok(Map.of("exits", exits));
    }

}
