package com.example.demo.dto.request;

import lombok.*;

import java.sql.Date;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    private String email;
    private String matKhau;
    private String hoTen;
    private Date ngaySinh;
    private String soDienThoai;

}
