package com.example.demo.repository;

import com.example.demo.entity.UserEntity;
import com.example.demo.entity.UserRoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRoleEntity, UUID> {
    List<UserRoleEntity> findByUserEntity(UserEntity userEntity);

    @Modifying
    @Transactional
    @Query("DELETE FROM UserRoleEntity ur WHERE ur.userEntity.id = :userId")
    void deleteByUserEntityId(UUID userId);

}
