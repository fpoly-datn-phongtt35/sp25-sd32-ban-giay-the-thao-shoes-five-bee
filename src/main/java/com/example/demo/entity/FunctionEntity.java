package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "TBL_FUNCTION")
public class FunctionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;
    @Column(name = "MA")
    private String ma;
    @Column(name = "NAME_URL")
    private String nameUrl;
    @Column(name = "TEN")
    private String ten;
    @Column(name = "MO_TA")
    private String moTa;
    @Column(name = "TRANG_THAI")
    private Integer trangThai;
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "functionEntity")
    @JsonIgnore
    private Set<PermissionEntity> permissionEntities = new HashSet<>();
    @OneToMany(mappedBy = "functionEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<FunctionRoleEntity> functionRoles = new HashSet<>();
}
