package com.example.demo.dto.request;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.time.LocalDate;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DanhGiaDto {
    private UUID id;
    private UUID hoaDonChiTietId;
    private UUID userId;
    private Integer saoDanhGia;
    private String nhanXet;
    private Date ngayNhanXet;


}
