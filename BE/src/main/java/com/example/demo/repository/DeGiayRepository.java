package com.example.demo.repository;

import com.example.demo.entity.DeGiayEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DeGiayRepository extends JpaRepository<DeGiayEntity, UUID>, JpaSpecificationExecutor<DeGiayEntity> {
}
