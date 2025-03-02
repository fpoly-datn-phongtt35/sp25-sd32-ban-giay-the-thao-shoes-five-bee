package com.example.demo.repository;

import com.example.demo.entity.DiaChiEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DiaChiRepository extends JpaRepository<DiaChiEntity, UUID> {
  void deleteByUserEntityId(UUID userId);

  @Query("SELECT u FROM DiaChiEntity u WHERE u.userEntity.id = :idUser")
  List<DiaChiEntity> getListDiaChiByUser(@Param("idUser") UUID idUser);

  UUID id(UUID id);
}
