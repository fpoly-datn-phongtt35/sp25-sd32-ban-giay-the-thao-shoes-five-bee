package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Table(name = "MAU_SAC")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MauSacEntity {
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

    @OneToMany(mappedBy = "mauSacEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<GiayChiTietEntity> giayChiTietEntities;
}
