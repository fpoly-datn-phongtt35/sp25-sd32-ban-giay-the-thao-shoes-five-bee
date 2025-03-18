package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "TRA_HANG")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TraHangEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;

    @Column(name = "MA")
    private String ma;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    @Column(name = "NGAY_TRA_HANG")
    private Date ngayTraHang;

    @Column(name = "LY_DO", columnDefinition = "NVARCHAR(255)")
    private String lyDo;

    @Column(name = "TONG_TIEN_HOAN_TRA")
    private BigDecimal tongTienHoanTra;

    @Column(name = "TRANG_THAI")
    private Integer trangThai;

    @ManyToOne
    @JoinColumn(name = "ID_HOA_DON", foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private HoaDonEntity hoaDonEntity;

    @ManyToOne
    @JoinColumn(name = "ID_USER", foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private UserEntity userEntity;

    @OneToMany(mappedBy = "traHangEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TraHangChiTietEntity> traHangChiTietEntities;
}
