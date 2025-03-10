package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "PERMISSION")
public class PermissionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;
    @Column(name = "MA")
    private String ma;
    @Column(name = "TEN",columnDefinition = "NVARCHAR(255)")
    private String ten;
    @Column(name = "MO_TA",columnDefinition = "NVARCHAR(255)")
    private String moTa;
    @Column(name = "TRANG_THAI")
    private Integer trangThai;
    @ManyToOne
    @JoinColumn(name = "FUNCTION_ID")
    private FunctionEntity functionEntity;
}
