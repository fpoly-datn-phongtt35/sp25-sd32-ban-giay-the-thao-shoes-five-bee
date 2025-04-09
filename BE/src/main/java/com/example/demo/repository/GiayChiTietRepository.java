package com.example.demo.repository;

import com.example.demo.entity.GiayChiTietEntity;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.example.demo.entity.GiayEntity;
import com.example.demo.entity.KichCoEntity;
import com.example.demo.entity.MauSacEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GiayChiTietRepository
    extends JpaRepository<GiayChiTietEntity, UUID>, JpaSpecificationExecutor<GiayChiTietEntity> {

  @Query("SELECT g FROM GiayChiTietEntity g " +
          "WHERE g.id NOT IN :excludeIds " +
          "AND g.giayEntity.danhMuc.id = :danhMucId " +
          "AND g.giayEntity.thuongHieu.id = :thuongHieuId " +
          "AND g.giayEntity.kieuDang.id = :kieuDangId " +
          "AND g.trangThai = 0 " +
          "ORDER BY g.giaBan ASC")
  List<GiayChiTietEntity> findSimilarProductsByGiay(
          @Param("danhMucId") UUID danhMucId,
          @Param("thuongHieuId") UUID thuongHieuId,
          @Param("kieuDangId") UUID kieuDangId,
          @Param("excludeIds") List<UUID> excludeIds);

  @Query("SELECT g FROM GiayChiTietEntity g " +
          "WHERE g.giayEntity.thuongHieu.id = :thuongHieuId " +
          "AND g.giayEntity.kieuDang.id = :kieuDangId " +
          "AND g.trangThai = 0 "+
          "AND g.id NOT IN :excludeIds")
  List<GiayChiTietEntity> findByThuongHieuAndKieuDang(
          @Param("thuongHieuId") UUID thuongHieuId,
          @Param("kieuDangId") UUID kieuDangId,
          @Param("excludeIds") List<UUID> excludeIds);

  @Query("SELECT g FROM GiayChiTietEntity g " +
          "WHERE g.giayEntity.thuongHieu.id = :thuongHieuId " +
          "AND g.giayEntity.danhMuc.id = :danhMucId " +
          "AND g.trangThai = 0 "+
          "AND g.id NOT IN :excludeIds")
  List<GiayChiTietEntity> findByThuongHieuAndDanhMuc(
          @Param("thuongHieuId") UUID thuongHieuId,
          @Param("danhMucId") UUID danhMucId,
          @Param("excludeIds") List<UUID> excludeIds);

  @Query("SELECT g FROM GiayChiTietEntity g " +
          "WHERE g.giayEntity.kieuDang.id = :kieuDangId " +
          "AND g.giayEntity.danhMuc.id = :danhMucId " +
          "AND g.trangThai = 0 "+
          "AND g.id NOT IN :excludeIds")
  List<GiayChiTietEntity> findByKieuDangAndDanhMuc(
          @Param("kieuDangId") UUID kieuDangId,
          @Param("danhMucId") UUID danhMucId,
          @Param("excludeIds") List<UUID> excludeIds);


  @Query("SELECT g FROM GiayChiTietEntity g " +
          "WHERE g.giayEntity.thuongHieu.id = :thuongHieuId " +
          "AND g.trangThai = 0 "+
          "AND g.id NOT IN :excludeIds")
  List<GiayChiTietEntity> findByThuongHieuAndNotCurrent(
          @Param("thuongHieuId") UUID thuongHieuId,
          @Param("excludeIds") List<UUID> excludeIds);

  @Query("SELECT g FROM GiayChiTietEntity g " +
          "WHERE g.giayEntity.kieuDang.id = :kieuDangId " +
          "AND g.trangThai = 0 "+
          "AND g.id NOT IN :excludeIds")
  List<GiayChiTietEntity> findByKieuDangAndNotCurrent(
          @Param("kieuDangId") UUID kieuDangId,
          @Param("excludeIds") List<UUID> excludeIds);

  @Query("SELECT g FROM GiayChiTietEntity g " +
          "WHERE g.giayEntity.danhMuc.id = :danhMucId " +
          "AND g.trangThai = 0 "+
          "AND g.id NOT IN :excludeIds")
  List<GiayChiTietEntity> findByDanhMucAndNotCurrent(
          @Param("danhMucId") UUID danhMucId,
          @Param("excludeIds") List<UUID> excludeIds);

  @Query("SELECT COALESCE(SUM(g.soLuongTon), 0) FROM GiayChiTietEntity g WHERE g.giayEntity.id = :giayId")
  int sumSoLuongTonByGiay(@Param("giayId") UUID giayId);

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
  //LOC

  List<GiayChiTietEntity> findByKichCoEntityId(UUID kichCoId);
  List<GiayChiTietEntity> findByGiayEntity_ThuongHieu_Id(UUID thuongHieuId);
  List<GiayChiTietEntity> findByMauSacEntityIdAndKichCoEntityId(UUID mauSacId, UUID kichCoId);
  List<GiayChiTietEntity> findByMauSacEntityIdAndKichCoEntityIdAndGiayEntity_ThuongHieu_Id(
          UUID mauSacId, UUID kichCoId, UUID thuongHieuId);

  //bien the
  Optional<GiayChiTietEntity> findByGiayEntityAndMauSacEntityAndKichCoEntity(GiayEntity giayEntity, MauSacEntity mauSacEntity, KichCoEntity kichCoEntity);

}
