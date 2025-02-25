package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Table(name = "KICH_CO")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class KichCoEntity {
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

    @OneToMany(mappedBy = "kichCoEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<GiayChiTietEntity> giayChiTietEntities;
}
