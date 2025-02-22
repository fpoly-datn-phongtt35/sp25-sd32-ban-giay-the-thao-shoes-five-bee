package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "CHAT_LIEU")
public class ChatLieuEntity {
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
