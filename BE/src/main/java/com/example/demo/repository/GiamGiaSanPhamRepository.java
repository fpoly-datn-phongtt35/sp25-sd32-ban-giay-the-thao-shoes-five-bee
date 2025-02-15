package com.example.demo.repository;

import com.example.demo.entity.GiamGiaSanPhamEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GiamGiaSanPhamRepository extends JpaRepository<GiamGiaSanPhamEntity, UUID>, JpaSpecificationExecutor<GiamGiaSanPhamEntity> {}
