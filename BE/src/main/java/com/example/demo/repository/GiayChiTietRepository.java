package com.example.demo.repository;

import com.example.demo.entity.GiayChiTietEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GiayChiTietRepository
    extends JpaRepository<GiayChiTietEntity, UUID>, JpaSpecificationExecutor<GiayChiTietEntity> {

  @Query("SELECT g FROM GiayChiTietEntity g WHERE g.id = :ids")
  List<GiayChiTietEntity> findGiayChiTietEntitiesByIds(List<UUID> ids);

  GiayChiTietEntity findByMaVach(String maVach);

  // Tìm theo ID giày và ID màu sắc
  @Query(
      "SELECT g FROM GiayChiTietEntity g WHERE g.giayEntity.id = :giayId AND g.mauSacEntity.id = :mauSacId")
  List<GiayChiTietEntity> findByGiayEntityIdAndMauSacEntityId(
      @Param("giayId") UUID giayId, @Param("mauSacId") UUID mauSacId);

  // Tìm theo ID thương hiệu và ID màu sắc
  @Query(
      "SELECT g FROM GiayChiTietEntity g WHERE g.giayEntity.thuongHieu.id = :thuongHieuId AND g.mauSacEntity.id = :mauSacId")
  List<GiayChiTietEntity> findByGiayEntityThuongHieuIdAndMauSacEntityId(
      @Param("thuongHieuId") UUID thuongHieuId, @Param("mauSacId") UUID mauSacId);

  // Tìm theo ID thương hiệu
  @Query("SELECT g FROM GiayChiTietEntity g WHERE g.giayEntity.thuongHieu.id = :thuongHieuId")
  List<GiayChiTietEntity> findByGiayEntityThuongHieuId(@Param("thuongHieuId") UUID thuongHieuId);

  // Tìm theo ID màu sắc
  @Query("SELECT g FROM GiayChiTietEntity g WHERE g.mauSacEntity.id = :mauSacId")
  List<GiayChiTietEntity> findByMauSacEntityId(@Param("mauSacId") UUID mauSacId);

  // Tìm theo ID giày
  @Query("SELECT g FROM GiayChiTietEntity g WHERE g.giayEntity.id = :giayId")
  List<GiayChiTietEntity> findByGiayEntityId(@Param("giayId") UUID giayId);
}
