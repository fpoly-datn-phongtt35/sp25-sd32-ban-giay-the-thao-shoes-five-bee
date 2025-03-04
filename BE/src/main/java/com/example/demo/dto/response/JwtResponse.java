package com.example.demo.dto.response;

import java.util.List;
import java.util.UUID;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String email;
    private String password;
    private List<String> roles;
    private String refreshToken;
    private UUID idGioHang;
    public JwtResponse(String token, String email, String password, List<String> roles, String refreshToken,UUID idGioHang) {
        this.token = token;
        this.email = email;
        this.password = password;
        this.roles = roles;
        this.refreshToken = refreshToken;
        this.idGioHang = idGioHang;
    }

    public UUID getIdGioHang() {
        return idGioHang;
    }

    public void setIdGioHang(UUID idGioHang) {
        this.idGioHang = idGioHang;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
