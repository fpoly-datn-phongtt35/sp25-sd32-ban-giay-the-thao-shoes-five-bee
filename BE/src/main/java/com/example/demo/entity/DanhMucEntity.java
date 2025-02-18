package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
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
    @Column(name = "TEN", columnDefinition = "NVARCHAR(255)")
    private String ten;
    @Column(name = "TRANG_THAI")
    private Integer trangThai;
    @OneToMany(mappedBy = "danhMuc", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<GiayEntity> giayEntities;
}
