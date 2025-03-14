package com.example.demo.controller;

import com.example.demo.dto.request.ExitEmailDto;
import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.request.SignupRequest;
import com.example.demo.dto.request.UserOtpDto;
import com.example.demo.jwt.JwtTokenProvider;
import com.example.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

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

    @PostMapping("/logout")
    public ResponseEntity<?> logout(){
        return authService.logout();
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

    @GetMapping("/user/id")
    public ResponseEntity<?>getUserId(@RequestHeader(value = "Authorization",required = false)String token){
        String userId = jwtTokenProvider.getCustomerIdFromJwt(token.replace("Bearer",""));
        return ResponseEntity.ok(userId);
    }
}
