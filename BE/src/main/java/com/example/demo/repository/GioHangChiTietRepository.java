package com.example.demo.repository;

import com.example.demo.entity.GiayChiTietEntity;
import com.example.demo.entity.GioHangChiTietEntity;
import com.example.demo.entity.GioHangEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GioHangChiTietRepository extends JpaRepository<GioHangChiTietEntity, UUID> {
    @Query("SELECT g FROM GioHangChiTietEntity g WHERE g.gioHangEntity.id = :idGioHang AND g.giayChiTietEntity.id = :idGiayChiTiet")
    Optional<GioHangChiTietEntity> findByGioHangEntityAndGiayChiTietEntity(
            @Param("idGioHang") UUID idGioHang,
            @Param("idGiayChiTiet") UUID idGiayChiTiet);

    @Query("SELECT g FROM GioHangChiTietEntity g WHERE g.gioHangEntity.id = :idGioHang")
    List<GioHangChiTietEntity> findByGioHangEntity(@Param("idGioHang") UUID idGioHang);

    @Query("SELECT g FROM GioHangChiTietEntity g WHERE g.id IN :ids")
    List<GioHangChiTietEntity> findByIds(List<UUID> ids);
}
