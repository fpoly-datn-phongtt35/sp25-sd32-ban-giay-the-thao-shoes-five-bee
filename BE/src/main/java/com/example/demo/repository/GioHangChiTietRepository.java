package com.example.demo.repository;

import com.example.demo.entity.GiayChiTietEntity;
import com.example.demo.entity.GioHangChiTietEntity;
import com.example.demo.entity.GioHangEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface GioHangChiTietRepository extends JpaRepository<GioHangChiTietEntity, UUID> {
    Optional<GioHangChiTietEntity> findByGioHangEntityAndGiayChiTietEntity(GioHangEntity gioHangEntity, GiayChiTietEntity giayChiTietEntity);
}
