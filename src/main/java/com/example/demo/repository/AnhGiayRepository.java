package com.example.demo.repository;

import com.example.demo.entity.AnhGiayEntity;
import java.util.List;
import java.util.UUID;
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
  @Query("UPDATE AnhGiayEntity a SET a.giay.id = :giayId WHERE a.id IN :ids")
  void assignToGiayByAnhGiayIdAndIds(@Param("giayId") Long giayId, @Param("ids") List<Long> ids);
}
