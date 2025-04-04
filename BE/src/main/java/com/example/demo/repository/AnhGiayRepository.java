package com.example.demo.repository;

import com.example.demo.entity.AnhGiayEntity;
import java.util.List;
import java.util.UUID;

import com.example.demo.entity.GiayChiTietEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface AnhGiayRepository extends JpaRepository<AnhGiayEntity, UUID> {

  @Modifying
  @Transactional
  @Query("UPDATE AnhGiayEntity a SET a.giayEntity.id = :giayId WHERE a.id IN :ids")
  void assignToGiayByAnhGiayIdAndIds(@Param("giayId") UUID giayId, @Param("ids") List<UUID> ids);

  @Transactional
  @Modifying
  @Query("UPDATE AnhGiayEntity a SET a.giayChiTietEntity.id = :giayId WHERE a.id IN :ids")
  void assignToGiayChiTietByAnhGiayIdAndIds(@Param("giayId") UUID giayId, @Param("ids") List<UUID> ids);

  List<AnhGiayEntity> findByGiayChiTietEntity_Id(UUID giayChiTietId);

  @Query("SELECT a FROM AnhGiayEntity a WHERE a.giayChiTietEntity.id = :giayChiTietId")
  List<AnhGiayEntity> findAnhByGiayChiTietId(@Param("giayChiTietId") UUID giayChiTietId);

  @Query("SELECT a FROM AnhGiayEntity a WHERE a.giayChiTietEntity.giayEntity.id = :giayId")
  List<AnhGiayEntity> findAnhByGiayId(@Param("giayId") UUID giayId);


}
