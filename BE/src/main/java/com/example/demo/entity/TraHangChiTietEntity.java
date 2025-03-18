package com.example.demo.entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "TRA_HANG_CHI_TIET")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TraHangChiTietEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;

    @Column(name = "SO_LUONG_TRA")
    private Integer soLuongTra;

    @Column(name = "GIA_HOAN_TRA")
    private BigDecimal giaHoanTra;

    @ManyToOne
    @JoinColumn(name = "ID_TRA_HANG", foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private TraHangEntity traHangEntity;

    @ManyToOne
    @JoinColumn(name = "ID_HOA_DON_CHI_TIET", foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private HoaDonChiTietEntity hoaDonChiTietEntity;
    @ManyToOne
    @JoinColumn(name = "ID_HOA_DON", foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private HoaDonEntity hoaDonEntity;  // Mối quan hệ với HoaDonEntity
}
