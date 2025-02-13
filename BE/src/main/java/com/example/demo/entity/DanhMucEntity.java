package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "DANH_MUC")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DanhMucEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;
    @Column(name = "MA")
    private String ma;
    @Column(name = "TEN")
    private String ten;
    @Column(name = "TRANG_THAI")
    private Integer trangThai;
    @ManyToOne
    @JoinColumn(name = "ID_GIAY")
    private GiayEntity giayEntity;
}
