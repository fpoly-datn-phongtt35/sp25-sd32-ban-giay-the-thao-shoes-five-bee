package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Table(name = "GIO_HANG_CHI_TIET")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class GioHangChiTietEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;

    @Column(name = "SO_LUONG")
    private Integer soLuong;

    @Column(name = "GHI_CHU",columnDefinition = "NVARCHAR(255)")
    private String ghiChu;

    @Column(name = "TRANG_THAI")
    private Integer trangThai;

    @ManyToOne
    @JoinColumn(name = "ID_GIO_HANG")
    private GioHangEntity gioHangEntity;

    @ManyToOne
    @JoinColumn(name = "ID_GIAY_CHI_TIET")
    private GiayChiTietEntity giayChiTietEntity;
}
