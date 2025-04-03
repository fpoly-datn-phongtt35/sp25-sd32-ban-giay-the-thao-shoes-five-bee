package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "CHUONG_TRINH_GIAM_GIA_CHI_TIET_SAN_PHAM")
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
@Getter
@Setter
public class GiamGiaChiTietSanPhamEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;

    @Column(name = "SO_TIEN_DA_GIAM")
    private BigDecimal soTienDaGiam;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Column(name = "NGAY_BAT_DAU")
    private Date ngayBatDau;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Column(name = "NGAY_KET_THUC")
    private Date ngayKetThuc;

    @Column(name = "TRANG_THAI")
    private Integer trangThai;

    @JsonBackReference(value = "giayChiTiet-giamGia")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ID_GIAY_CHI_TIET",foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private GiayChiTietEntity giayChiTiet;

    @JsonBackReference(value = "chuongTrinh-giamGia")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ID_CHUONG_TRINH_GIAM_GIA_SAN_PHAM",foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private GiamGiaSanPhamEntity chuongTrinhGiamSanPhamEntity;
}
