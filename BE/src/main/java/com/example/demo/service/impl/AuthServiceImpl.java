package com.example.demo.service.impl;

import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.request.SignupRequest;
import com.example.demo.dto.request.UserOtpDto;
import com.example.demo.dto.response.JwtResponse;
import com.example.demo.entity.GioHangEntity;
import com.example.demo.entity.RoleEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.entity.UserRoleEntity;
import com.example.demo.jwt.JwtTokenProvider;
import com.example.demo.repository.GioHangRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.UserRoleRepository;
import com.example.demo.security.CustomUserDetail;
import com.example.demo.security.OtpUtil;
import com.example.demo.service.AuthService;
import com.example.demo.service.SendMailService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private UserRoleRepository userRoleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private SendMailService sendMailService;
    @Autowired
    private GioHangRepository gioHangRepository;
    private final JavaMailSender javaMailSender;

    @Override
    public ResponseEntity<?> login(LoginRequest loginRequest) {
        if(loginRequest.getEmail() == null || loginRequest.getEmail().isEmpty()){
            return ResponseEntity.badRequest().body("email khong duoc để trống");
        }
        if(loginRequest.getMatKhau() == null || loginRequest.getMatKhau().isEmpty()){
            return ResponseEntity.badRequest().body("mat khau khong được để trống");
        }
        UserEntity userEntity = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(()-> new RuntimeException("email chưa được đăng kí"));
        if(!userEntity.getIsEnabled()){
            return ResponseEntity.badRequest().body("tài khoản này chưa được kích hoạt");
        }
        
        // Kiểm tra và tạo giỏ hàng nếu chưa có
        if (userEntity.getGioHangEntity() == null) {
            GioHangEntity gioHangEntity = new GioHangEntity();
            gioHangEntity.setMa(generateUniqueCode());
            gioHangEntity.setUserEntity(userEntity);
            gioHangEntity.setNgayTao(new Date(System.currentTimeMillis()));
            gioHangEntity.setNgayCapNhat(new Date(System.currentTimeMillis()));
            gioHangEntity.setTrangThai(1);
            gioHangEntity.setGhiChu("Giỏ hàng mới tạo");
            gioHangRepository.save(gioHangEntity);
            
            userEntity.setGioHangEntity(gioHangEntity);
            userRepository.save(userEntity);
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),loginRequest.getMatKhau())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtTokenProvider.getToken(authentication);
            CustomUserDetail userDetail = (CustomUserDetail) authentication.getPrincipal();
            List<String> roles = userDetail.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());
            String refreshToken = jwtTokenProvider.refreshToken(userEntity.getHoTen());

            return ResponseEntity.ok(new JwtResponse(
                token,
                userDetail.getEmail(),
                userDetail.getPassword(),
                roles,
                refreshToken,
                userEntity.getGioHangEntity().getId()
            ));
        } catch (BadCredentialsException ex){
            throw new RuntimeException("email hoặc mật khẩu không đúng");
        } catch (ExpiredJwtException exx){
            throw new RuntimeException("accessToken hết hạn vui lòng làm mới ");
        }
    }

    @Override
    public ResponseEntity<?> registerUser(SignupRequest signupRequest, String roleName) {
        if(userRepository.existsByEmail(signupRequest.getEmail())){
            return ResponseEntity.badRequest().body("lỗi email đang được sử dụng");
        }
        UserEntity userEntity = new UserEntity();
        userEntity.setEmail(signupRequest.getEmail());
        userEntity.setMatKhau(passwordEncoder.encode(signupRequest.getMatKhau()));
        userEntity.setSoDienThoai(signupRequest.getSoDienThoai());
        userEntity.setHoTen(signupRequest.getHoTen());
        userEntity.setNgaySinh(signupRequest.getNgaySinh());
        userEntity.setIsEnabled(false);
        String otpCode = OtpUtil.generateOtp(6);
        userEntity.setOtpCode(otpCode);
        userEntity.setOtpGeneratedTime(LocalDateTime.now());
        UserEntity savedUser = userRepository.save(userEntity);

        RoleEntity roleEntity = roleRepository.findByTen(roleName)
                .orElseGet(() ->{
                    RoleEntity newRole = new RoleEntity();
                    newRole.setTen(roleName);
                    return roleRepository.save(newRole);
                });
        UserRoleEntity userRoleEntity = new UserRoleEntity();
        userRoleEntity.setUserEntity(savedUser);
        userRoleEntity.setRoleEntity(roleEntity);

        userRoleRepository.save(userRoleEntity);

        GioHangEntity gioHangEntity = new GioHangEntity();
        gioHangEntity.setMa(generateUniqueCode());
        gioHangEntity.setUserEntity(userEntity);
        gioHangEntity.setNgayTao(new Date(System.currentTimeMillis()));
        gioHangEntity.setNgayCapNhat(new Date(System.currentTimeMillis()));
        gioHangEntity.setTrangThai(1);
        gioHangEntity.setGhiChu("Giỏ hàng mới tạo");
        gioHangRepository.save(gioHangEntity);

        userEntity.setGioHangEntity(gioHangEntity);
        userRepository.save(userEntity);

        buildEmail(userEntity.getHoTen(),otpCode,signupRequest.getEmail());
        return ResponseEntity.ok(Map.of("message","Người dùng đã được đăng kí . Vui lòng kiểm tra email để nhận mã OTP"));
    }

    private String generateUniqueCode() {
        return "GH" + UUID.randomUUID().toString().substring(0,6).toUpperCase();
    }

    @Override
    public ResponseEntity<?> registerNhanVien(SignupRequest signupRequest) {
        return registerUser(signupRequest,"ROLE_ADMIN");
    }

    @Override
    public ResponseEntity<?> registerKhachHang(SignupRequest signupRequest) {
        return registerUser(signupRequest,"ROLE_USER");
    }

    @Override
    public ResponseEntity<?> registerStaff(SignupRequest signupRequest) {
        return registerUser(signupRequest,"ROLE_STAFF");
    }

    @Override
    public Boolean userEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public ResponseEntity<?> checkOtp(UserOtpDto userOtpDto) {
        UserEntity user = userRepository.findByEmail(userOtpDto.getEmail()).orElseThrow(() -> new RuntimeException("Không tìm thấy email người dùng"));
        if (user.getOtpGeneratedTime() == null || user.getOtpCode() == null) {
            return ResponseEntity.badRequest().body("Mã otp không tồn tại hoặc đã hết thời gian");
        }
        if (user.getOtpCode() == null || !user.getOtpCode().trim().equals(userOtpDto.getOtpCode())) {
            return ResponseEntity.badRequest().body("Mã otp không hợp lệ");
        }
        if (Duration.between(user.getOtpGeneratedTime(), LocalDateTime.now()).getSeconds() > 3000) {
            return ResponseEntity.badRequest().body("Mã otp đã hết hạn");
        }
        user.setIsEnabled(true);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Kích hoạt tài khoản thành công"));
    }
    @Override
    public ResponseEntity<?> logout() {
        try {
            SecurityContextHolder.getContext();
            return  ResponseEntity.ok(Map.of("message","đăng xuất thành công"));
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Có lỗi xảy ra khi đăng xuất");
        }
    }
    @Override
    public ResponseEntity<?> sendBackOtp(UserOtpDto userOtpDto) {
        UserEntity userEntity = userRepository.findByEmail(userOtpDto.getEmail())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy email người dùng này"));

        if (userEntity.getIsEnabled()) {
            return ResponseEntity.ok(Map.of("message", "Tài khoản của người dùng đã được kích hoạt"));
        }

        String newOtp = OtpUtil.generateOtp(6);
        userEntity.setOtpCode(newOtp);
        userEntity.setOtpGeneratedTime(LocalDateTime.now());
        userRepository.save(userEntity);

        // Gửi email
        buildEmail(userEntity.getHoTen(), newOtp, userOtpDto.getEmail());

        return ResponseEntity.ok(Map.of("message", "Mã OTP mới đã được gửi đến email của bạn. Vui lòng kiểm tra để xác nhận."));
    }

    private void buildEmail(String name, String otpCode, String toEmail) {
        String emailBody = String.format("""
        <html>
        <body style="font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#0b0c0c">
            <table role="presentation" width="100%%" style="border-collapse:collapse;min-width:100%%;width:100%%!important" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td bgcolor="#0b0c0c" style="padding:20px;text-align:center;">
                        <span style="font-size:28px;line-height:1.3;color:#ffffff;font-weight:bold;">Xác nhận đăng ký tài khoản</span>
                    </td>
                </tr>
            </table>
            <table align="center" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%%;margin:20px auto;">
                <tr>
                    <td style="font-size:19px;line-height:1.6;color:#0b0c0c;padding:10px 20px;">
                        <p>Chào <strong>%s</strong>,</p>
                        <p>Cảm ơn bạn đã đăng ký tài khoản. Đây là mã OTP của bạn:</p>
                        <p style="font-size:24px;font-weight:bold;text-align:center;color:#1D70B8;">%s</p>
                        <p>Mã OTP này sẽ hết hạn sau 5 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
                        <p>Hẹn gặp lại!</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """, name, otpCode);

        // Gọi service đã sửa để đảm bảo gửi đúng encoding
        sendMailService.sendMail(toEmail, emailBody, "OTP mới của bạn");
    }

}
