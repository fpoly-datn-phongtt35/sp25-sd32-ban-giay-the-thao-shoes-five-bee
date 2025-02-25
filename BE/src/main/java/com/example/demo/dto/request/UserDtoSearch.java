package com.example.demo.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDtoSearch extends PageDto {
    private String hoTen;
    private String email;
    private Date ngaySinh;
    private Date khoangNgaySinh;
    private String soDienThoai;
}
