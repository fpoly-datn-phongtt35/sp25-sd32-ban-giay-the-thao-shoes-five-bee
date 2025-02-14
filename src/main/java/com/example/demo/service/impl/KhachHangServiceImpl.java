package com.example.demo.service.impl;

import com.example.demo.dto.request.DiaChiDto;
import com.example.demo.dto.request.KhachHangDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.DiaChiEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.repository.DiaChiRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.KhachHangService;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class KhachHangServiceImpl implements KhachHangService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DiaChiRepository   diaChiRepository;


    private KhachHangDto convertToDTO(UserEntity userEntity) {

        List<DiaChiDto> diaChiDtos = userEntity.getDiaChiEntities().stream()
                .map(diaChiEntity -> new DiaChiDto(
                        diaChiEntity.getId(),
                        diaChiEntity.getMa(),
                        diaChiEntity.getTenDiaChi(),
                        diaChiEntity.getTenNguoiNhan(),
                        diaChiEntity.getSdtNguoiNhan(),
                        diaChiEntity.getXa(),
                        diaChiEntity.getHuyen(),
                        diaChiEntity.getThanhPho(),
                        diaChiEntity.getTrangThai()
                ))
                .collect(Collectors.toList());

        return new KhachHangDto(
                userEntity.getId(),
                userEntity.getMa(),
                userEntity.getHoTen(),
                userEntity.getEmail(),
                userEntity.getSoDienThoai(),
                userEntity.getTrangThai(),
                diaChiDtos
        );
    }


    private UserEntity convertToEntity(KhachHangDto khachHangDto) {
        UserEntity userEntity = new UserEntity();


        userEntity.setId(khachHangDto.getId());
        userEntity.setMa(khachHangDto.getMa());
        userEntity.setHoTen(khachHangDto.getHoTen());
        userEntity.setEmail(khachHangDto.getEmail());
        userEntity.setSoDienThoai(khachHangDto.getSoDienThoai());
        userEntity.setTrangThai(khachHangDto.getTrangThai());

        if (khachHangDto.getDiaChiEntities() != null) {
            List<DiaChiEntity> diaChiEntities = khachHangDto.getDiaChiEntities().stream()
                    .map(diaChiDto -> {
                        DiaChiEntity diaChiEntity = new DiaChiEntity();
                        diaChiEntity.setMa(diaChiDto.getMa());
                        diaChiEntity.setTenDiaChi(diaChiDto.getTenDiaChi());
                        diaChiEntity.setTenNguoiNhan(diaChiDto.getTenNguoiNhan());
                        diaChiEntity.setSdtNguoiNhan(diaChiDto.getSdtNguoiNhan());
                        diaChiEntity.setXa(diaChiDto.getXa());
                        diaChiEntity.setHuyen(diaChiDto.getHuyen());
                        diaChiEntity.setThanhPho(diaChiDto.getThanhPho());
                        diaChiEntity.setTrangThai(diaChiDto.getTrangThai());
                        diaChiEntity.setUserEntity(userEntity);
                        return diaChiEntity;
                    })
                    .collect(Collectors.toList());

            userEntity.setDiaChiEntities(diaChiEntities);
        }

        return userEntity;
    }


    @Override
    public KhachHangDto createUser(KhachHangDto khachHangDto) {
        UserEntity userEntity = convertToEntity(khachHangDto);
        if (khachHangDto.getDiaChiEntities() != null) {
            for (DiaChiDto diaChiDto : khachHangDto.getDiaChiEntities()) {
                boolean diaChiExists = userEntity.getDiaChiEntities().stream()
                        .anyMatch(d -> d.getXa().equals(diaChiDto.getXa()) &&
                                d.getHuyen().equals(diaChiDto.getHuyen()) &&
                                d.getThanhPho().equals(diaChiDto.getThanhPho()) &&
                                d.getTenDiaChi().equals(diaChiDto.getTenDiaChi()));

                if (!diaChiExists) {
                    DiaChiEntity diaChiEntity = new DiaChiEntity();
                    diaChiEntity.setUserEntity(userEntity);
                    diaChiEntity.setTenDiaChi(diaChiDto.getTenDiaChi());
                    diaChiEntity.setXa(diaChiDto.getXa());
                    diaChiEntity.setHuyen(diaChiDto.getHuyen());
                    diaChiEntity.setThanhPho(diaChiDto.getThanhPho());
                    diaChiEntity.setTrangThai(diaChiDto.getTrangThai());
                    userEntity.getDiaChiEntities().add(diaChiEntity);
                }
            }
        }
        UserEntity savedUserEntity = userRepository.save(userEntity);
        return convertToDTO(savedUserEntity);
    }


    //getAll
    @Override
    public List<KhachHangDto> getAllUsers() {
        List<UserEntity> userEntities = userRepository.findAll();
        return userEntities.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
//tim user theo id
    @Override
    public Optional<KhachHangDto> getUserById(UUID id) {
        Optional<UserEntity> userEntity = userRepository.findById(id);
        return userEntity.map(this::convertToDTO);
    }
//update truc tiep dia chi
@Override
public KhachHangDto updateUser(UUID id, KhachHangDto updatedKhachHangDto) {
    Optional<UserEntity> existingUser = userRepository.findById(id);
    if (existingUser.isPresent()) {
        UserEntity userEntity = existingUser.get();
        userEntity.setHoTen(updatedKhachHangDto.getHoTen());
        userEntity.setEmail(updatedKhachHangDto.getEmail());
        userEntity.setSoDienThoai(updatedKhachHangDto.getSoDienThoai());
        userEntity.setTrangThai(updatedKhachHangDto.getTrangThai());

        if (updatedKhachHangDto.getDiaChiEntities() != null && !updatedKhachHangDto.getDiaChiEntities().isEmpty()) {
            List<UUID> existingDiaChiIds = userEntity.getDiaChiEntities().stream()
                    .map(DiaChiEntity::getId)
                    .collect(Collectors.toList());
            for (DiaChiDto diaChiDto : updatedKhachHangDto.getDiaChiEntities()) {
                if (diaChiDto.getId() != null && existingDiaChiIds.contains(diaChiDto.getId())) {
                    DiaChiEntity existingDiaChi = diaChiRepository.findById(diaChiDto.getId())
                            .orElseThrow(() -> new RuntimeException("Address not found"));
                    if (!existingDiaChi.getUserEntity().getId().equals(userEntity.getId())) {
                        throw new RuntimeException("Address does not belong to the specified user");
                    }
                    existingDiaChi.setTenDiaChi(diaChiDto.getTenDiaChi());
                    existingDiaChi.setXa(diaChiDto.getXa());
                    existingDiaChi.setHuyen(diaChiDto.getHuyen());
                    existingDiaChi.setThanhPho(diaChiDto.getThanhPho());
                    existingDiaChi.setTrangThai(diaChiDto.getTrangThai());
                    diaChiRepository.save(existingDiaChi);
                }
            }
        }

        userRepository.save(userEntity);

        userRepository.flush();

        return convertToDTO(userEntity);
    }
    return null;
}

//update dia chi bang pop up
@Override
public KhachHangDto updateAddress(UUID addressId, DiaChiDto updatedDiaChiDto) {

    Optional<DiaChiEntity> existingDiaChi = diaChiRepository.findById(addressId);

    if (existingDiaChi.isPresent()) {
        DiaChiEntity diaChiEntity = existingDiaChi.get();
        UserEntity userEntity = diaChiEntity.getUserEntity();
        System.out.println("Thông tin người dùng của địa chỉ: " + userEntity.getHoTen());
        diaChiEntity.setTenDiaChi(updatedDiaChiDto.getTenDiaChi());
        diaChiEntity.setXa(updatedDiaChiDto.getXa());
        diaChiEntity.setHuyen(updatedDiaChiDto.getHuyen());
        diaChiEntity.setThanhPho(updatedDiaChiDto.getThanhPho());
        diaChiEntity.setTrangThai(updatedDiaChiDto.getTrangThai());
        diaChiRepository.save(diaChiEntity);


        return convertToDTO(userEntity);
    } else {
        throw new RuntimeException("Địa chỉ không tìm thấy!");
    }
}







    // Tìm và xóa người dùng theo ID
    @Override
    public boolean deleteUser(UUID id) {
        Optional<UserEntity> userEntity = userRepository.findById(id);
        if (userEntity.isPresent()) {
            userRepository.delete(userEntity.get());
            return true;
        }
        return false;
    }

    @Override
    public KhachHangDto getKhachHangDetails(UUID id) {
        Optional<UserEntity> existingUser = userRepository.findById(id);
        if (existingUser.isPresent()) {
            UserEntity userEntity = existingUser.get();


            KhachHangDto khachHangDto = convertToDTO(userEntity);


            List<DiaChiDto> diaChiDtos = new ArrayList<>();
            for (DiaChiEntity diaChiEntity : userEntity.getDiaChiEntities()) {
                DiaChiDto diaChiDto = new DiaChiDto();
                diaChiDto.setId(diaChiEntity.getId());
                diaChiDto.setTenDiaChi(diaChiEntity.getTenDiaChi());
                diaChiDto.setXa(diaChiEntity.getXa());
                diaChiDto.setHuyen(diaChiEntity.getHuyen());
                diaChiDto.setThanhPho(diaChiEntity.getThanhPho());
                diaChiDto.setTrangThai(diaChiEntity.getTrangThai());


                diaChiDtos.add(diaChiDto);
            }

            khachHangDto.setDiaChiEntities(diaChiDtos);

            return khachHangDto;
        }
        return null;
    }



    @Override
    public PageResponse<UserEntity> findByPagingCriteria(KhachHangDto khachHangDto, Pageable pageable) {
        Page<UserEntity> page = userRepository.findAll(
                new Specification<UserEntity>() {
                    @Override
                    public Predicate toPredicate(Root<UserEntity> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                        List<Predicate> predicates = new ArrayList<>();

                        if (khachHangDto != null) {
                            // Kiểm tra điều kiện cho "ma"
                            if (khachHangDto.getMa() != null && !khachHangDto.getMa().isEmpty()) {
                                predicates.add(criteriaBuilder.like(root.get("ma"), "%" + khachHangDto.getMa() + "%"));
                            }

                            // Kiểm tra điều kiện cho "hoTen"
                            if (khachHangDto.getHoTen() != null && !khachHangDto.getHoTen().isEmpty()) {
                                predicates.add(criteriaBuilder.like(root.get("hoTen"), "%" + khachHangDto.getHoTen() + "%"));
                            }

                            // Kiểm tra điều kiện cho "email"
                            if (khachHangDto.getEmail() != null && !khachHangDto.getEmail().isEmpty()) {
                                predicates.add(criteriaBuilder.like(root.get("email"), "%" + khachHangDto.getEmail() + "%"));
                            }

                            // Kiểm tra điều kiện cho "soDienThoai"
                            if (khachHangDto.getSoDienThoai() != null && !khachHangDto.getSoDienThoai().isEmpty()) {
                                predicates.add(criteriaBuilder.like(root.get("soDienThoai"), "%" + khachHangDto.getSoDienThoai() + "%"));
                            }




                            // Kiểm tra điều kiện cho "trangThai"
                            if (khachHangDto.getTrangThai() != null) {
                                predicates.add(criteriaBuilder.equal(root.get("trangThai"), khachHangDto.getTrangThai()));
                            }
                        }

                        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
                    }
                },
                pageable);


        PageResponse<UserEntity> pageResponse = new PageResponse<>();
        pageResponse.setTotalElements((int) page.getTotalElements());
        pageResponse.setTotalPages(page.getTotalPages());
        pageResponse.setSize(page.getSize());
        pageResponse.setPage(page.getNumber() + 1);
        pageResponse.setContent(page.getContent());

        return pageResponse;
    }


}
