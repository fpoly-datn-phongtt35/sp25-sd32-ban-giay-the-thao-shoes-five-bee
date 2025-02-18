package com.example.demo.repository;

import com.example.demo.entity.HoaDonEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDonEntity, UUID>, JpaSpecificationExecutor<HoaDonEntity> {

    @Query("select h from HoaDonEntity h where h.trangThai = 1 and h.hinhThucMua=1 order by h.ngayTao")
    List<HoaDonEntity> getListByTrangThai();
    //xong
}
