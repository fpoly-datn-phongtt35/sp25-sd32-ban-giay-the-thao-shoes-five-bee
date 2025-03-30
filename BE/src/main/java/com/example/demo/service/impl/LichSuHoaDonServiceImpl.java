package com.example.demo.service.impl;

import com.example.demo.dto.request.LichSuHoaDonDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.LichSuHoaDonEntity;
import com.example.demo.repository.HoaDonRepository;
import com.example.demo.repository.LichSuHoaDonRepository;
import com.example.demo.service.LichSuHoaDonService;
import com.example.demo.service.UsersService;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LichSuHoaDonServiceImpl implements LichSuHoaDonService {

  private final UsersService usersService;
  private final LichSuHoaDonRepository lichSuHoaDonRepository;
  private final HoaDonRepository hoaDonRepository;

  @Override
  public void createLichSuHoaDon(UUID hoaDonId, Integer trangThaiMoi, Integer trangThaiCu) {
    lichSuHoaDonRepository.save(
        LichSuHoaDonEntity.builder()
            .hoaDonEntity(hoaDonRepository.findById(hoaDonId).orElse(null))
            .trangThaiMoi(trangThaiMoi)
            .trangThaiCu(trangThaiCu)
            .nguoiCapNhat(usersService.getAuthenticatedUserEmail())
            .thoiGianCapNhat(new Date(System.currentTimeMillis()))
            .build());
  }

  @Override
  public List<LichSuHoaDonEntity> getListLichSuHoaDonByHoaDonId(UUID hoaDonId) {
    return lichSuHoaDonRepository.getListLichSuHoaDonByHoaDonId(hoaDonId);
  }

  @Override
  public List<LichSuHoaDonEntity> getAll() {
    return lichSuHoaDonRepository.findAll();
  }

  @Override
  public LichSuHoaDonEntity add(LichSuHoaDonDto lichSuHoaDonDto) {
    LichSuHoaDonEntity lichSuHoaDonEntity = new LichSuHoaDonEntity();
    lichSuHoaDonEntity.setHoaDonEntity(
        hoaDonRepository.findById(lichSuHoaDonDto.getHoaDonDto().getId()).orElse(null));
    lichSuHoaDonEntity.setTrangThaiCu(lichSuHoaDonDto.getTrangThaiCu());
    lichSuHoaDonEntity.setTrangThaiMoi(lichSuHoaDonDto.getTrangThaiMoi());
    lichSuHoaDonEntity.setNguoiCapNhat(lichSuHoaDonDto.getNguoiCapNhat());
    lichSuHoaDonEntity.setThoiGianCapNhat(new Date(System.currentTimeMillis()));
    lichSuHoaDonEntity.setGhiChu(lichSuHoaDonDto.getGhiChu());
    return lichSuHoaDonRepository.save(lichSuHoaDonEntity);
  }

  @Override
  public LichSuHoaDonEntity update(LichSuHoaDonDto lichSuHoaDonDto) {
    Optional<LichSuHoaDonEntity> optional =
        lichSuHoaDonRepository.findById(lichSuHoaDonDto.getId());
    return optional
        .map(
            o -> {
              o.setHoaDonEntity(
                  hoaDonRepository.findById(lichSuHoaDonDto.getHoaDonDto().getId()).orElse(null));
              o.setTrangThaiCu(lichSuHoaDonDto.getTrangThaiCu());
              o.setTrangThaiMoi(lichSuHoaDonDto.getTrangThaiMoi());
              o.setNguoiCapNhat(lichSuHoaDonDto.getNguoiCapNhat());
              o.setThoiGianCapNhat(new Date(System.currentTimeMillis()));
              o.setGhiChu(lichSuHoaDonDto.getGhiChu());
              return lichSuHoaDonRepository.save(o);
            })
        .orElse(null);
  }

  @Override
  public LichSuHoaDonEntity detail(UUID id) {
    return lichSuHoaDonRepository.findById(id).orElse(null);
  }

  @Override
  public LichSuHoaDonEntity delete(UUID id) {
    LichSuHoaDonEntity lichSuHoaDonEntity = lichSuHoaDonRepository.findById(id).orElse(null);
    lichSuHoaDonRepository.delete(lichSuHoaDonEntity);
    return lichSuHoaDonEntity;
  }

  @Override
  public PageResponse<LichSuHoaDonEntity> findByPagingCriteria(
      LichSuHoaDonDto lichSuHoaDonDto, Pageable pageable) {
    Page<LichSuHoaDonEntity> page =
        lichSuHoaDonRepository.findAll(
            new Specification<LichSuHoaDonEntity>() {
              @Override
              public Predicate toPredicate(
                  Root<LichSuHoaDonEntity> root,
                  CriteriaQuery<?> query,
                  CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();
                if (lichSuHoaDonDto != null) {
                  if (lichSuHoaDonDto.getTrangThaiCu() != null) {
                    predicates.add(
                        criteriaBuilder.equal(
                            root.get("trangThaiCu"), lichSuHoaDonDto.getTrangThaiCu()));
                  }

                  if (lichSuHoaDonDto.getTrangThaiMoi() != null) {
                    predicates.add(
                        criteriaBuilder.equal(
                            root.get("trangThaiMoi"), lichSuHoaDonDto.getTrangThaiMoi()));
                  }
                  if (lichSuHoaDonDto.getNguoiCapNhat() != null
                      && !lichSuHoaDonDto.getNguoiCapNhat().isEmpty()) {
                    predicates.add(
                        criteriaBuilder.like(
                            root.get("nguoiCapNhat"),
                            "%" + lichSuHoaDonDto.getNguoiCapNhat() + "%"));
                  }
                  if (lichSuHoaDonDto.getThoiGianCapNhat() != null) {
                    predicates.add(
                        criteriaBuilder.like(
                            root.get("thoiGianCapNhat"),
                            "%" + lichSuHoaDonDto.getThoiGianCapNhat() + "%"));
                  }
                  if (lichSuHoaDonDto.getGhiChu() != null
                      && !lichSuHoaDonDto.getGhiChu().isEmpty()) {
                    predicates.add(
                        criteriaBuilder.like(
                            root.get("ghiChu"), "%" + lichSuHoaDonDto.getGhiChu() + "%"));
                  }
                }
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
              }
            },
            pageable);
    PageResponse<LichSuHoaDonEntity> pageResponse = new PageResponse<>();
    pageResponse.setTotalElements((int) page.getTotalElements());
    pageResponse.setTotalPages(page.getTotalPages());
    pageResponse.setSize(page.getSize());
    pageResponse.setPage(page.getNumber() + 1);
    pageResponse.setContent(page.getContent());

    return pageResponse;
  }
}
