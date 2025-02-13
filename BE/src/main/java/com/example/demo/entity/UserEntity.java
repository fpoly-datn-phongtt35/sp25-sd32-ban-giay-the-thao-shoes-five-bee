package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "TBL_USER")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;
    @Column(name = "MA")
    private String ma;
    @Column(name = "ANH")
    private String anh;
    @Column(name = "HO_TEN")
    private String hoTen;
    @Column(name = "NGAY_SINH")
    private Date ngaySinh;
    @Column(name = "DIA_CHI")
    private String diaChi;
    @Column(name = "XA")
    private String xa;
    @Column(name = "HUYEN")
    private String huyen;
    @Column(name = "THANH_PHO")
    private String thanhPho;
    @Column(name = "SO_DIEN_THOAI")
    private String soDienThoai;
    @Column(name = "EMAIL")
    private String email;
    @Column(name = "MAT_KHAU")
    private String matKhau;
    @Column(name = "NGAY_VAO_LAM")
    private Date ngayLamViec;
    @Column(name = "NGAY_NGHI_VIEC")
    private Date ngayNghiViec;
    @Column(name = "TRANG_THAI")
    private Integer trangThai;
    @Column(name = "IS_ENABLED")
    private Boolean isEnabled = false;
    @Column(name = "OTP_CODE")
    private String otpCode;
    @Column(name = "OTP_GENERATED_TIME")
    private LocalDateTime otpGeneratedTime;
    @OneToMany(mappedBy = "userEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DiaChiEntity> diaChiEntities;
}
