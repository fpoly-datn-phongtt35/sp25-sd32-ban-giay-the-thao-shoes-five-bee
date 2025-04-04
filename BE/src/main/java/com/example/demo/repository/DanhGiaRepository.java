package com.example.demo.repository;

import com.example.demo.entity.DanhGiaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DanhGiaRepository extends JpaRepository<DanhGiaEntity, UUID> {
    List<DanhGiaEntity> findByHoaDonChiTietEntityId(UUID hoaDonChiTietId);

    @Query("SELECT dg FROM DanhGiaEntity dg " +
            "JOIN dg.hoaDonChiTietEntity hdct " +
            "JOIN hdct.giayChiTietEntity gct " +
            "JOIN gct.giayEntity g " +
            "WHERE g.id = :giayId")
    List<DanhGiaEntity> findByGiayId(@Param("giayId") UUID giayId);
}
