package com.example.demo.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserDto {
    private UUID id;
    private String anh;
    private String hoTen;
    private Date ngaySinh;
    private String soDienThoai;
    private String email;
    private String matKhau;
    private Boolean isEnabled = true;
    private List<String> roleNames;
    
    public UserDto(UUID id, String anh, String hoTen, String email, String soDienThoai, Date ngaySinh, String matKhau, Boolean isEnabled, List<String> roleNames) {
    }
}
