package com.example.demo.repository;

import com.example.demo.entity.SubscriptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SubcriptionRepository extends JpaRepository<SubscriptionEntity,UUID> {
    @Query("SELECT s FROM SubscriptionEntity s where s.giayChiTietEntity.id = :giayChiTietId")
    List<SubscriptionEntity> findByGiayChiTietId(@Param("giayChiTietId") UUID giayChiTietId);
}
