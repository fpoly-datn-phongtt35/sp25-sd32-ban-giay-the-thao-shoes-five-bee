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
@Table(name = "TBL_USER_ROLE")
public class UserRoleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;
    @Column(name = "TRANG_THAI")
    private Integer trangThai;
    @ManyToOne
    @JoinColumn(name = "USER_ID")
    private UserEntity userEntity;
    @ManyToOne
    @JoinColumn(name = "ROLE_ID")
    private RoleEntity roleEntity;
}
