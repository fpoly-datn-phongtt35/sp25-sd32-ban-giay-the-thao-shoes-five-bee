package com.example.demo.service.impl;

import com.example.demo.dto.request.GiamGiaSanPhamDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.GiamGiaSanPhamEntity;
import com.example.demo.repository.GiamGiaSanPhamRepository;
import com.example.demo.service.GiamGiaSanPhamService;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GiamGiaSanPhamServiceImpl implements GiamGiaSanPhamService {
  private final GiamGiaSanPhamRepository giamGiaSanPhamRepository;

  @Override
  public List<GiamGiaSanPhamEntity> getAll() {
    return giamGiaSanPhamRepository.findAll();
  }

  @Override
  public GiamGiaSanPhamEntity add(GiamGiaSanPhamDto giamGiaSanPhamDto) {
    return giamGiaSanPhamRepository.save(
        GiamGiaSanPhamEntity.builder()
            .ma(giamGiaSanPhamDto.getMa())
            .ten(giamGiaSanPhamDto.getTen())
            .phanTramGiam(giamGiaSanPhamDto.getPhanTramGiam())
            .ngayBatDau(giamGiaSanPhamDto.getNgayBatDau())
            .ngayKetThuc(giamGiaSanPhamDto.getNgayKetThuc())
            .trangThai(giamGiaSanPhamDto.getTrangThai())
            .build());
  }

  @Override
  public GiamGiaSanPhamEntity update(GiamGiaSanPhamDto giamGiaSanPhamDto) {
    Optional<GiamGiaSanPhamEntity> optional =
        giamGiaSanPhamRepository.findById(giamGiaSanPhamDto.getId());
    return optional
        .map(
            o -> {
              o.setMa(giamGiaSanPhamDto.getMa());
              o.setTen(giamGiaSanPhamDto.getTen());
              o.setPhanTramGiam(giamGiaSanPhamDto.getPhanTramGiam());
              o.setNgayBatDau(giamGiaSanPhamDto.getNgayBatDau());
              o.setNgayKetThuc(giamGiaSanPhamDto.getNgayKetThuc());
              o.setTrangThai(giamGiaSanPhamDto.getTrangThai());
              return giamGiaSanPhamRepository.save(o);
            })
        .orElse(null);
  }

  @Override
  public GiamGiaSanPhamEntity detail(GiamGiaSanPhamDto giamGiaSanPhamDto) {
    Optional<GiamGiaSanPhamEntity> optional =
        giamGiaSanPhamRepository.findById(giamGiaSanPhamDto.getId());
    return optional.orElse(null);
  }

  @Override
  public GiamGiaSanPhamEntity delete(GiamGiaSanPhamDto giamGiaSanPhamDto) {
    Optional<GiamGiaSanPhamEntity> optional =
        giamGiaSanPhamRepository.findById(giamGiaSanPhamDto.getId());
    return optional
        .map(
            o -> {
              giamGiaSanPhamRepository.delete(o);
              return o;
            })
        .orElse(null);
  }

  @Override
  public PageResponse<GiamGiaSanPhamEntity> findByPagingCriteria(
      GiamGiaSanPhamDto giamGiaSanPhamDto, Pageable pageable) {
    Page<GiamGiaSanPhamEntity> page =
        giamGiaSanPhamRepository.findAll(
            new Specification<GiamGiaSanPhamEntity>() {
              @Override
              public Predicate toPredicate(
                  Root<GiamGiaSanPhamEntity> root,
                  CriteriaQuery<?> query,
                  CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();
                if (giamGiaSanPhamDto != null) {
                  // Kiểm tra điều kiện cho "ma"
                  if (giamGiaSanPhamDto.getMa() != null && !giamGiaSanPhamDto.getMa().isEmpty()) {
                    predicates.add(
                        criteriaBuilder.like(
                            root.get("ma"), "%" + giamGiaSanPhamDto.getMa() + "%"));
                  }

                  // Kiểm tra điều kiện cho "ten"
                  if (giamGiaSanPhamDto.getTen() != null && !giamGiaSanPhamDto.getTen().isEmpty()) {
                    predicates.add(
                        criteriaBuilder.like(
                            root.get("ten"), "%" + giamGiaSanPhamDto.getTen() + "%"));
                  }

                  // Kiểm tra điều kiện cho "phanTramGiam"
                  if (giamGiaSanPhamDto.getPhanTramGiam() != null) {
                    predicates.add(
                        criteriaBuilder.equal(
                            root.get("phanTramGiam"), giamGiaSanPhamDto.getPhanTramGiam()));
                  }

                  // Kiểm tra điều kiện cho "ngayBatDau"
                  if (giamGiaSanPhamDto.getNgayBatDau() != null) {
                    predicates.add(
                        criteriaBuilder.greaterThanOrEqualTo(
                            root.get("ngayBatDau"), giamGiaSanPhamDto.getNgayBatDau()));
                  }

                  // Kiểm tra điều kiện cho "ngayKetThuc"
                  if (giamGiaSanPhamDto.getNgayKetThuc() != null) {
                    predicates.add(
                        criteriaBuilder.lessThanOrEqualTo(
                            root.get("ngayKetThuc"), giamGiaSanPhamDto.getNgayKetThuc()));
                  }

                  // Kiểm tra điều kiện cho "trangThai"
                  if (giamGiaSanPhamDto.getTrangThai() != null) {
                    predicates.add(
                        criteriaBuilder.equal(
                            root.get("trangThai"), giamGiaSanPhamDto.getTrangThai()));
                  }
                }
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
              }
            },
            pageable);
    PageResponse<GiamGiaSanPhamEntity> pageResponse = new PageResponse<>();
    pageResponse.setTotalElements((int) page.getTotalElements());
    pageResponse.setTotalPages(page.getTotalPages());
    pageResponse.setSize(page.getSize());
    pageResponse.setPage(page.getNumber() + 1);
    pageResponse.setContent(page.getContent());

    return pageResponse;
  }
}
