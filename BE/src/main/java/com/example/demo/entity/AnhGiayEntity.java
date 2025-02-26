package com.example.demo.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "ANH_GIAY")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AnhGiayEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;
    @Column(name = "TEN_URL")
    private String tenUrl;
    @Column(name = "TRANG_THAI")
    private Integer trangThai;
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "ID_GIAY")
    private GiayEntity giayEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "ID_GIAY_CHI_TIET", foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private GiayChiTietEntity giayChiTietEntity;

}
