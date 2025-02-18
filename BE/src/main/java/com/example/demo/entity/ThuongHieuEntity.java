package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Table(name = "THUONG_HIEU")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ThuongHieuEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;

    @Column(name = "MA")
    private String ma;

    @Column(name = "TEN",columnDefinition = "NVARCHAR(255)")
    private String ten;

    @Column(name = "TRANG_THAI")
    private Integer trangThai;
}
