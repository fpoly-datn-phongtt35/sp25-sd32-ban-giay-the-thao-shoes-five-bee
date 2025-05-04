package com.example.demo.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
@Getter
@Setter
public class GiamGiaHoaDonDto extends PageDto{
    private UUID id;
    private String ma;
    private String ten;
    private BigDecimal dieuKien;
    private BigDecimal soTienGiamMax;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd",timezone = "Asia/Ho_Chi_Minh")
    private Date ngayBatDau;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd",timezone = "Asia/Ho_Chi_Minh")
    private Date ngayKetThuc;
    private Integer phanTramGiam;
    private Integer soLuong;
    private Integer trangThai;
}
