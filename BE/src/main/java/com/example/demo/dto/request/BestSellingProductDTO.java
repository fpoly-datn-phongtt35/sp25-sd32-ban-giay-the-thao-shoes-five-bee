package com.example.demo.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BestSellingProductDTO {

    private String tenGiay; // Tên giày// URL ảnh giày
    private String mauSac;
    private String danhMuc;
    private String thuongHieu;// Màu sắc của giày
    private String kichCo;   // Kích cỡ của giày
    private Long soLuongBan; // Số lượng đã bán
    private String tenUrl;
    public BestSellingProductDTO(String tenGiay, String mauSac, String kichCo, String danhMuc, String thuongHieu, String tenUrl, Long soLuongBan) {
        this.tenGiay = tenGiay;
        this.mauSac = mauSac;
        this.kichCo = kichCo;
        this.danhMuc = danhMuc;
        this.thuongHieu = thuongHieu;
        this.tenUrl = tenUrl;
        this.soLuongBan = soLuongBan;
    }


}
