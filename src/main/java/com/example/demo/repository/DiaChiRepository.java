package com.example.demo.repository;

import com.example.demo.entity.DiaChiEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Optional;
import java.util.UUID;

@RequestMapping
public interface DiaChiRepository extends JpaRepository<DiaChiEntity, UUID>, JpaSpecificationExecutor<DiaChiEntity> {
    DiaChiEntity findByTenDiaChiAndXaAndHuyen(String tenDiaChi, String xa, String huyen);
    Optional<DiaChiEntity> findById(UUID id);
}
