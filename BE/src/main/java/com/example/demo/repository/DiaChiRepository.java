package com.example.demo.repository;

import com.example.demo.entity.DiaChiEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Repository
public interface DiaChiRepository extends JpaRepository<DiaChiEntity, UUID> {

    @Query("SELECT d FROM DiaChiEntity d where d.userEntity.id =:idUser")
    List<DiaChiEntity> findByIdUser(@Param("idUser") UUID idUser);

    @Transactional
    @Modifying
    void deleteByUserEntityId(UUID userId);

    @Transactional
    @Modifying
    @Query("update DiaChiEntity d set d.trangThai = 0 where d.userEntity.id=:idUser")
    void updateTrangThaiToZero(@Param("idUser")UUID idUser);
}
