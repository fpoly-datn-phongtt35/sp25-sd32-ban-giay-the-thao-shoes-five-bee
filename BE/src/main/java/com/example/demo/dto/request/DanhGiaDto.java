package com.example.demo.dto.request;


import lombok.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class DanhGiaDto {
    private UUID id;
    private UUID hoaDonChiTietId;
    private UUID userId;
    private String userFullName;
    private Integer saoDanhGia;
    private String nhanXet;
    private Date ngayNhanXet;


}
