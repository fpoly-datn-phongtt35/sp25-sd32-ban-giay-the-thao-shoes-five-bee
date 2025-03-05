package com.example.demo.service.impl;

import com.example.demo.dto.request.GiamGiaHoaDonDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.GiamGiaHoaDonEntity;
import com.example.demo.repository.GiamGiaHoaDonRepository;
import com.example.demo.service.GiamGiaHoaDonService;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GiamGiaHoaDonServiceImpl implements GiamGiaHoaDonService {

  private final GiamGiaHoaDonRepository giamGiaHoaDonRepository;

  @Override
  public void updateTrangThaiGiamGiaHoaDon() {
    giamGiaHoaDonRepository.findAll().stream()
        .filter(g -> g.getNgayKetThuc().after(new Date()))
        .forEach(
            gg -> {
              gg.setTrangThai(1);
              giamGiaHoaDonRepository.save(gg);
            });
  }

  @Override
  public GiamGiaHoaDonEntity getGiamGia(String ma) {
    if (ma != null && !ma.isEmpty()) {
      return giamGiaHoaDonRepository.findByMa(ma);
    }

    List<GiamGiaHoaDonEntity> dsGiamGia = giamGiaHoaDonRepository.findGiamGiaConSoLuong();
    return dsGiamGia.isEmpty() ? null : dsGiamGia.get(0);
  }

  @Override
  public List<GiamGiaHoaDonEntity> getAll() {
    return giamGiaHoaDonRepository.findAll();
  }

  @Override
  public GiamGiaHoaDonEntity add(GiamGiaHoaDonDto giamGiaHoaDonDto) {
    return giamGiaHoaDonRepository.save(
        GiamGiaHoaDonEntity.builder()
            .ma(giamGiaHoaDonDto.getMa())
            .ten(giamGiaHoaDonDto.getTen())
            .dieuKien(giamGiaHoaDonDto.getDieuKien())
            .soTienGiamMax(giamGiaHoaDonDto.getSoTienGiamMax())
            .ngayBatDau(giamGiaHoaDonDto.getNgayBatDau())
            .ngayKetThuc(giamGiaHoaDonDto.getNgayKetThuc())
            .phanTramGiam(giamGiaHoaDonDto.getPhanTramGiam())
            .soLuong(giamGiaHoaDonDto.getSoLuong())
            .trangThai(giamGiaHoaDonDto.getTrangThai())
            .build());
  }

  @Override
  public GiamGiaHoaDonEntity update(GiamGiaHoaDonDto giamGiaHoaDonDto) {
    Optional<GiamGiaHoaDonEntity> optional =
        giamGiaHoaDonRepository.findById(giamGiaHoaDonDto.getId());
    return optional
        .map(
            o -> {
              o.setMa(giamGiaHoaDonDto.getMa());
              o.setTen(giamGiaHoaDonDto.getTen());
              o.setDieuKien(giamGiaHoaDonDto.getDieuKien());
              o.setSoTienGiamMax(giamGiaHoaDonDto.getSoTienGiamMax());
              o.setNgayBatDau(giamGiaHoaDonDto.getNgayBatDau());
              o.setNgayKetThuc(giamGiaHoaDonDto.getNgayKetThuc());
              o.setPhanTramGiam(giamGiaHoaDonDto.getPhanTramGiam());
              o.setSoLuong(giamGiaHoaDonDto.getSoLuong());
              o.setTrangThai(giamGiaHoaDonDto.getTrangThai());
              return giamGiaHoaDonRepository.save(o);
            })
        .orElse(null);
  }

  @Override
  public GiamGiaHoaDonEntity detail(GiamGiaHoaDonDto giamGiaHoaDonDto) {
    Optional<GiamGiaHoaDonEntity> optional =
        giamGiaHoaDonRepository.findById(giamGiaHoaDonDto.getId());
    return optional.orElse(null);
  }

  @Override
  public GiamGiaHoaDonEntity delete(GiamGiaHoaDonDto giamGiaHoaDonDto) {
    Optional<GiamGiaHoaDonEntity> optional =
        giamGiaHoaDonRepository.findById(giamGiaHoaDonDto.getId());
    return optional
        .map(
            o -> {
              giamGiaHoaDonRepository.delete(o);
              return o;
            })
        .orElse(null);
  }

  @Override
  public PageResponse<GiamGiaHoaDonEntity> findByPagingCriteria(
      GiamGiaHoaDonDto giamGiaHoaDonDto, Pageable pageable) {
    Page<GiamGiaHoaDonEntity> page =
        giamGiaHoaDonRepository.findAll(
            new Specification<GiamGiaHoaDonEntity>() {
              @Override
              public Predicate toPredicate(
                  Root<GiamGiaHoaDonEntity> root,
                  CriteriaQuery<?> query,
                  CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();
                if (giamGiaHoaDonDto != null) {
                  // Kiểm tra điều kiện cho "ma"
                  if (giamGiaHoaDonDto.getMa() != null && !giamGiaHoaDonDto.getMa().isEmpty()) {
                    predicates.add(
                        criteriaBuilder.like(root.get("ma"), "%" + giamGiaHoaDonDto.getMa() + "%"));
                  }

                  // Kiểm tra điều kiện cho "ten"
                  if (giamGiaHoaDonDto.getTen() != null && !giamGiaHoaDonDto.getTen().isEmpty()) {
                    predicates.add(
                        criteriaBuilder.like(
                            root.get("ten"), "%" + giamGiaHoaDonDto.getTen() + "%"));
                  }

                  // Kiểm tra điều kiện cho "trangThai"
                  if (giamGiaHoaDonDto.getTrangThai() != null) {
                    predicates.add(
                        criteriaBuilder.equal(
                            root.get("trangThai"), giamGiaHoaDonDto.getTrangThai()));
                  }

                  // Kiểm tra điều kiện cho "dieuKien"
                  if (giamGiaHoaDonDto.getDieuKien() != null) {
                    predicates.add(
                        criteriaBuilder.equal(
                            root.get("dieuKien"), giamGiaHoaDonDto.getDieuKien()));
                  }

                  // Kiểm tra điều kiện cho "soTienGiamMax"
                  if (giamGiaHoaDonDto.getSoTienGiamMax() != null) {
                    predicates.add(
                        criteriaBuilder.equal(
                            root.get("soTienGiamMax"), giamGiaHoaDonDto.getSoTienGiamMax()));
                  }

                  // Kiểm tra điều kiện cho "ngayBatDau"
                  if (giamGiaHoaDonDto.getNgayBatDau() != null) {
                    predicates.add(
                        criteriaBuilder.greaterThanOrEqualTo(
                            root.get("ngayBatDau"), giamGiaHoaDonDto.getNgayBatDau()));
                  }

                  // Kiểm tra điều kiện cho "ngayKetThuc"
                  if (giamGiaHoaDonDto.getNgayKetThuc() != null) {
                    predicates.add(
                        criteriaBuilder.lessThanOrEqualTo(
                            root.get("ngayKetThuc"), giamGiaHoaDonDto.getNgayKetThuc()));
                  }

                  // Kiểm tra điều kiện cho "phanTramGiam"
                  if (giamGiaHoaDonDto.getPhanTramGiam() != null) {
                    predicates.add(
                        criteriaBuilder.equal(
                            root.get("phanTramGiam"), giamGiaHoaDonDto.getPhanTramGiam()));
                  }

                  // Kiểm tra điều kiện cho "soLuong"
                  if (giamGiaHoaDonDto.getSoLuong() != null) {
                    predicates.add(
                        criteriaBuilder.equal(root.get("soLuong"), giamGiaHoaDonDto.getSoLuong()));
                  }
                }
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
              }
            },
            pageable);
    PageResponse<GiamGiaHoaDonEntity> pageResponse = new PageResponse<>();
    pageResponse.setTotalElements((int) page.getTotalElements());
    pageResponse.setTotalPages(page.getTotalPages());
    pageResponse.setSize(page.getSize());
    pageResponse.setPage(page.getNumber() + 1);
    pageResponse.setContent(page.getContent());

    return pageResponse;
  }
}
