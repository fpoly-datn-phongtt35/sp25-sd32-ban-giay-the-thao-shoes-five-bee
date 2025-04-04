package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "DANH_GIA")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DanhGiaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;
    @Column(name = "SAO_DANH_GIA")
    private Integer saoDanhGia;
    @Column(name = "NHAN_XET")
    private String nhanXet;
    @Column(name = "NGAY_NHAN_XET")
    private Date ngayNhanXet;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "HOA_DON_CHI_TIET_ID",referencedColumnName = "ID")
    private HoaDonChiTietEntity hoaDonChiTietEntity;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name =  "USER_ID",referencedColumnName = "ID")
    private UserEntity userEntity;
}
