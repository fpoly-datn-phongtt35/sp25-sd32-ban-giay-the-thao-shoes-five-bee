package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "TBL_USER")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;
    @Column(name = "MA")
    private String ma;
    @Column(name = "ANH")
    private String anh;
    @Column(name = "HO_TEN",columnDefinition = "NVARCHAR(255)")
    private String hoTen;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    @Column(name = "NGAY_SINH")
    private Date ngaySinh;
    @Column(name = "SO_DIEN_THOAI")
    private String soDienThoai;
    @Column(name = "EMAIL")
    private String email;
    @Column(name = "MAT_KHAU")
    private String matKhau;
    @Column(name = "TRANG_THAI")
    private Integer trangThai;
    @Column(name = "IS_ENABLED")
    private Boolean isEnabled = false;
    @Column(name = "OTP_CODE")
    private String otpCode;
    @Column(name = "OTP_GENERATED_TIME")
    private LocalDateTime otpGeneratedTime;

    @OneToMany(mappedBy = "userEntity", cascade = CascadeType.REMOVE, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<DiaChiEntity> diaChiEntities;

    @OneToMany(mappedBy = "userEntity", cascade = CascadeType.REMOVE, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<UserRoleEntity> userRoleEntities = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "ID_GIO_HANG")
    private GioHangEntity gioHangEntity;
}
