package com.example.demo.repository;

import com.example.demo.entity.GiayEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GiayRepository extends JpaRepository<GiayEntity, UUID>, JpaSpecificationExecutor<GiayEntity> {

    @Query("SELECT g FROM GiayEntity g JOIN FETCH g.anhGiayEntities WHERE g.id = :id")
    GiayEntity findWithAnhGiayById(@Param("id") Long id);

}
