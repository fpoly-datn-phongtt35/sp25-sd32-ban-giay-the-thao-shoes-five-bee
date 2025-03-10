package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "TBL_ROLE")
public class RoleEntity {
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
    @OneToMany(mappedBy = "roleEntity", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<UserRoleEntity> userRoleEntities = new ArrayList<>();

}


