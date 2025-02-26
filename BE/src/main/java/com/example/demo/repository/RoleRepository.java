package com.example.demo.repository;

import com.example.demo.entity.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<RoleEntity, UUID> {
    Optional<RoleEntity> findByTen(String ten);

    @Query(value = "SELECT f.TEN, f.NAME_URL, ua.TEN\n" +
            "FROM RoleEntity r\n" +
            "JOIN PermissionRoleEntity uar ON r.ID = uar.ROLE_ID\n" +
            "JOIN PermissionEntity ua ON ua.ID = uar.PERMISSION_ID\n" +
            "JOIN FunctionEntity f ON f.ID = ua.FUNCTION_ID\n" +
            "WHERE r.TEN IN (:roles)",nativeQuery = true)
    List<String> findRoleFunctionAndPermission(List<String> roles);

    @Query("select r from RoleEntity r where r.ten=?1")
    RoleEntity findByName(String ten);
}
