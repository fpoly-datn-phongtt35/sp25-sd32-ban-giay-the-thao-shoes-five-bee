package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.sql.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "CHUONG_TRINH_GIAM_GIA_SAN_PHAM")
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
@Getter
@Setter
public class GiamGiaSanPhamEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;
    @Column(name = "MA")
    private String ma;
    @Column(name = "TEN",columnDefinition = "NVARCHAR(255)")
    private String ten;
    @Column(name = "PHAN_TRAM_GIAM")
    private Integer phanTramGiam;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd" )
    @Column(name = "NGAY_BAT_DAU")
    private Date ngayBatDau;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Column(name = "NGAY_KET_THUC")
    private Date ngayKetThuc;
    @Column(name = "TRANG_THAI")
    private Integer trangThai;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ID_USER",foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private UserEntity userEntity;

    @OneToMany(mappedBy = "chuongTrinhGiamSanPhamEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "chuongTrinh-giamGia")
    private List<GiamGiaChiTietSanPhamEntity> giamGiaChiTietSanPhamEntities;

}
