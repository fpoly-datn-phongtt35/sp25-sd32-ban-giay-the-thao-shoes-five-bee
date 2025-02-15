package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.jmx.export.annotation.ManagedAttribute;

import java.util.UUID;

@Entity
@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "PERMISSION_ROLE")
public class PermissionRoleEntity {
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
    @JoinColumn(name = "PERMISSION_ID")
    private PermissionEntity permissionEntity;
}
