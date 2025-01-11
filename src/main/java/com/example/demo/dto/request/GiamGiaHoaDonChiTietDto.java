package com.example.demo.dto.request;

import com.example.demo.entity.ChuongTrinhGiamGiaHoaDonEntity;
import com.example.demo.entity.HoaDonEntity;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
@Getter
@Setter
public class GiamGiaHoaDonChiTietDto extends PageDto{
    private UUID id;
    private BigDecimal tongTien;
    private BigDecimal soTienDaGiam;
    private BigDecimal tongTienThanhToan;
    private Integer trangThai;
}
