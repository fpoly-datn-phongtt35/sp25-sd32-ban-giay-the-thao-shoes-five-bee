package com.example.demo.repository;

import com.example.demo.entity.GiayChiTietEntity;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.example.demo.entity.GiayEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GiayChiTietRepository
        extends JpaRepository<GiayChiTietEntity, UUID>, JpaSpecificationExecutor<GiayChiTietEntity> {


  List<GiayChiTietEntity> findByGiayEntity(GiayEntity giay);

  @Query("SELECT g FROM GiayChiTietEntity g WHERE g.id IN :ids")
  List<GiayChiTietEntity> findGiayChiTietEntitiesByIds(List<UUID> ids);

  Optional<GiayChiTietEntity> findByMaVach(String maVach);

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


  //LOC

  List<GiayChiTietEntity> findByKichCoEntityId(UUID kichCoId);
  List<GiayChiTietEntity> findByGiayEntity_ThuongHieu_Id(UUID thuongHieuId);
  List<GiayChiTietEntity> findByMauSacEntityIdAndKichCoEntityId(UUID mauSacId, UUID kichCoId);
  List<GiayChiTietEntity> findByMauSacEntityIdAndKichCoEntityIdAndGiayEntity_ThuongHieu_Id(
          UUID mauSacId, UUID kichCoId, UUID thuongHieuId);


}
