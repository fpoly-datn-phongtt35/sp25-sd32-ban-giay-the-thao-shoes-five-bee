package com.example.demo.service.impl;

import com.example.demo.dto.request.GiamGiaHoaDonChiTietDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.GiamGiaHoaDonChiTietEntity;
import com.example.demo.entity.GiamGiaHoaDonEntity;
import com.example.demo.entity.HoaDonChiTietEntity;
import com.example.demo.entity.HoaDonEntity;
import com.example.demo.repository.GiamGiaHoaDonChiTietRepository;
import com.example.demo.repository.GiamGiaHoaDonRepository;
import com.example.demo.repository.HoaDonChiTietRepository;
import com.example.demo.repository.HoaDonRepository;
import com.example.demo.service.GiamGiaHoaDonChiTietService;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import java.math.BigDecimal;
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
public class GiamGiaHoaDonChiTietServiceImpl implements GiamGiaHoaDonChiTietService {
  private final GiamGiaHoaDonChiTietRepository giamGiaHoaDonChiTietRepository;
  private final HoaDonRepository hoaDonRepository;
  private final GiamGiaHoaDonRepository giamGiaHoaDonRepository;
  private final HoaDonChiTietRepository hoaDonChiTietRepository;

  @Override
  public BigDecimal apDungPhieuGiamGia(
      UUID hoaDonId, GiamGiaHoaDonEntity giamGiaHoaDonEntity, BigDecimal tongTienSanPham) {
    HoaDonEntity hoaDon =
        hoaDonRepository
            .findById(hoaDonId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn!"));

    // Kiểm tra điều kiện áp dụng
    BigDecimal soTienDaGiam =
        tongTienSanPham
            .multiply(BigDecimal.valueOf(giamGiaHoaDonEntity.getPhanTramGiam()))
            .divide(BigDecimal.valueOf(100));

    if (soTienDaGiam.compareTo(giamGiaHoaDonEntity.getSoTienGiamMax()) > 0) {
      soTienDaGiam = giamGiaHoaDonEntity.getSoTienGiamMax();
    }

    // Lưu thông tin giảm giá vào bảng chi tiết
    GiamGiaHoaDonChiTietEntity chiTietGiamGia = new GiamGiaHoaDonChiTietEntity();
    chiTietGiamGia.setHoaDonEntity(hoaDon);
    chiTietGiamGia.setChuongTrinhGiamGiaHoaDonEntity(giamGiaHoaDonEntity);
    chiTietGiamGia.setTongTien(hoaDon.getTongTien());
    chiTietGiamGia.setSoTienDaGiam(soTienDaGiam);
    //  chiTietGiamGia.setTongTienThanhToan(tongTienThanhToan);
    chiTietGiamGia.setTrangThai(1);

    giamGiaHoaDonChiTietRepository.save(chiTietGiamGia);

    // Giảm số lượng phiếu giảm giá
    giamGiaHoaDonEntity.setSoLuong(giamGiaHoaDonEntity.getSoLuong() - 1);
    giamGiaHoaDonRepository.save(giamGiaHoaDonEntity);

    return soTienDaGiam;
  }

  @Override
  public List<GiamGiaHoaDonChiTietEntity> getAll() {
    return giamGiaHoaDonChiTietRepository.findAll();
  }

  @Override
  public GiamGiaHoaDonChiTietEntity add(GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto) {
    return giamGiaHoaDonChiTietRepository.save(
        GiamGiaHoaDonChiTietEntity.builder()
            .tongTien(giamGiaHoaDonChiTietDto.getTongTien())
            .soTienDaGiam(giamGiaHoaDonChiTietDto.getSoTienDaGiam())
            .tongTienThanhToan(giamGiaHoaDonChiTietDto.getTongTienThanhToan())
            .trangThai(giamGiaHoaDonChiTietDto.getTrangThai())
            .hoaDonEntity(
                hoaDonRepository
                    .findById(giamGiaHoaDonChiTietDto.getHoaDonDto().getId())
                    .orElse(null))
            .chuongTrinhGiamGiaHoaDonEntity(
                giamGiaHoaDonRepository
                    .findById(giamGiaHoaDonChiTietDto.getGiamGiaHoaDonDto().getId())
                    .orElse(null))
            .build());
  }

  @Override
  public GiamGiaHoaDonChiTietEntity update(GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto) {
    Optional<GiamGiaHoaDonChiTietEntity> optional =
        giamGiaHoaDonChiTietRepository.findById(giamGiaHoaDonChiTietDto.getId());
    return optional
        .map(
            o -> {
              o.setTongTien(giamGiaHoaDonChiTietDto.getTongTien());
              o.setSoTienDaGiam(giamGiaHoaDonChiTietDto.getSoTienDaGiam());
              o.setTongTienThanhToan(giamGiaHoaDonChiTietDto.getTongTienThanhToan());
              o.setTrangThai(giamGiaHoaDonChiTietDto.getTrangThai());
              o.setHoaDonEntity(
                  hoaDonRepository
                      .findById(giamGiaHoaDonChiTietDto.getHoaDonDto().getId())
                      .orElse(null));
              o.setChuongTrinhGiamGiaHoaDonEntity(
                  giamGiaHoaDonRepository
                      .findById(giamGiaHoaDonChiTietDto.getGiamGiaHoaDonDto().getId())
                      .orElse(null));
              return giamGiaHoaDonChiTietRepository.save(o);
            })
        .orElse(null);
  }

  @Override
  public GiamGiaHoaDonChiTietEntity detail(GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto) {
    Optional<GiamGiaHoaDonChiTietEntity> optional =
        giamGiaHoaDonChiTietRepository.findById(giamGiaHoaDonChiTietDto.getId());
    return optional.orElse(null);
  }

  @Override
  public GiamGiaHoaDonChiTietEntity delete(GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto) {
    Optional<GiamGiaHoaDonChiTietEntity> optional =
        giamGiaHoaDonChiTietRepository.findById(giamGiaHoaDonChiTietDto.getId());
    return optional
        .map(
            o -> {
              giamGiaHoaDonChiTietRepository.delete(o);
              return o;
            })
        .orElse(null);
  }

  @Override
  public PageResponse<GiamGiaHoaDonChiTietEntity> findByPagingCriteria(
      GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto, Pageable pageable) {
    Page<GiamGiaHoaDonChiTietEntity> page =
        giamGiaHoaDonChiTietRepository.findAll(
            new Specification<GiamGiaHoaDonChiTietEntity>() {
              @Override
              public Predicate toPredicate(
                  Root<GiamGiaHoaDonChiTietEntity> root,
                  CriteriaQuery<?> query,
                  CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();
                if (giamGiaHoaDonChiTietDto != null) {

                  // Kiểm tra điều kiện cho "tongTien"
                  if (giamGiaHoaDonChiTietDto.getTongTien() != null) {
                    predicates.add(
                        criteriaBuilder.equal(
                            root.get("tongTien"), giamGiaHoaDonChiTietDto.getTongTien()));
                  }

                  // Kiểm tra điều kiện cho "soTienDaGiam"
                  if (giamGiaHoaDonChiTietDto.getSoTienDaGiam() != null) {
                    predicates.add(
                        criteriaBuilder.equal(
                            root.get("soTienDaGiam"), giamGiaHoaDonChiTietDto.getSoTienDaGiam()));
                  }

                  // Kiểm tra điều kiện cho "tongTienThanhToan"
                  if (giamGiaHoaDonChiTietDto.getTongTienThanhToan() != null) {
                    predicates.add(
                        criteriaBuilder.equal(
                            root.get("tongTienThanhToan"),
                            giamGiaHoaDonChiTietDto.getTongTienThanhToan()));
                  }

                  // Kiểm tra điều kiện cho "trangThai"
                  if (giamGiaHoaDonChiTietDto.getTrangThai() != null) {
                    predicates.add(
                        criteriaBuilder.equal(
                            root.get("trangThai"), giamGiaHoaDonChiTietDto.getTrangThai()));
                  }
                }
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
              }
            },
            pageable);
    PageResponse<GiamGiaHoaDonChiTietEntity> pageResponse = new PageResponse<>();
    pageResponse.setTotalElements((int) page.getTotalElements());
    pageResponse.setTotalPages(page.getTotalPages());
    pageResponse.setSize(page.getSize());
    pageResponse.setPage(page.getNumber() + 1);
    pageResponse.setContent(page.getContent());

    return pageResponse;
  }
}
