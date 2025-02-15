package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ROLE_FUNCTION")
public class FunctionRoleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;
    @Column(name = "TRANG_THAI")
    private Integer trangThai;
    @ManyToOne
    @JoinColumn(name = "ROLE_ID")
    private RoleEntity roleEntity;
    @ManyToOne
    @JoinColumn(name = "FUNCTION_ID")
    private FunctionEntity functionEntity;

}
