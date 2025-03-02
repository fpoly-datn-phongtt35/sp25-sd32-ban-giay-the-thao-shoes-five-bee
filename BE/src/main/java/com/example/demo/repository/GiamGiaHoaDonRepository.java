package com.example.demo.repository;

import com.example.demo.entity.GiamGiaHoaDonEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface GiamGiaHoaDonRepository
    extends JpaRepository<GiamGiaHoaDonEntity, UUID>,
        JpaSpecificationExecutor<GiamGiaHoaDonEntity> {

  GiamGiaHoaDonEntity findByMa(String ten);

  String ma(String ma);
}
