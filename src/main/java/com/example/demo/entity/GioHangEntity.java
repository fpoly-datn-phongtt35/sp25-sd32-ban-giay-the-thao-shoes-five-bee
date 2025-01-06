package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@Table(name = "GIO_HANG")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class GioHangEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;

    @Column(name = "MA")
    private String ma;

    @Column(name = "NGAY_TAO")
    private Date ngayTao;

    @Column(name = "NGAY_CAP_NHAT")
    private Date ngayCapNhat;

    @Column(name = "GHI_CHU")
    private String ghiChu;

    @Column(name = "TRANG_THAI")
    private Integer trangThai;

    @OneToOne
    @JoinColumn(name = "ID_USER")
    private UserEntity userEntity;
}
