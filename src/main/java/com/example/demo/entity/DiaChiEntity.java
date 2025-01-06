package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Table(name = "DIA_CHI")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DiaChiEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;

    @Column(name = "MA")
    private String ma;

    @Column(name = "TEN_DIA_CHI")
    private String tenDiaChi;

    @Column(name = "TEN_NGUOI_NHAN")
    private String tenNguoiNhan;

    @Column(name = "SO_DIEN_THOAI_NGUOI_NHAN")
    private String sdtNguoiNhan;

    @Column(name = "XA")
    private String xa;

    @Column(name = "HUYEN")
    private String huyen;

    @Column(name = "THANH_PHO")
    private String thanhPho;

    @Column(name = "TRANG_THAI")
    private Integer trangThai;

    // khoa ngoai
    @ManyToOne
    @JoinColumn(name = "ID_USER")
    private UserEntity userEntity;
}
