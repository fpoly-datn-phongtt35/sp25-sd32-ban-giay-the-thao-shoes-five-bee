package com.example.demo.repository;

import com.example.demo.entity.ChuongTrinhGiamSanPhamEntity;
import com.example.demo.entity.GiayEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GiayRepository extends JpaRepository<GiayEntity, UUID>, JpaSpecificationExecutor<GiayEntity> {}
