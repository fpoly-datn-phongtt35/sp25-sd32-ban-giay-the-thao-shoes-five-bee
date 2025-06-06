package com.example.demo.repository;

import com.example.demo.entity.KichCoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface KichCoRepository extends JpaRepository<KichCoEntity, UUID>, JpaSpecificationExecutor<KichCoEntity> {
    public boolean existsByTenIgnoreCase(String ten);


}
