package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;
@Table(name = "DE_GIAY")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class DeGiayEntity {
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
}
