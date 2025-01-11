package com.example.demo.repository;

import com.example.demo.entity.ChuongTrinhGiamGiaHoaDonEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface GiamGiaHoaDonRepository
    extends JpaRepository<ChuongTrinhGiamGiaHoaDonEntity, UUID>,
        JpaSpecificationExecutor<ChuongTrinhGiamGiaHoaDonEntity> {}
