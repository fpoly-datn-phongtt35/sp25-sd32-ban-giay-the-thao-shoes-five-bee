package com.example.demo.service.impl;

import com.example.demo.dto.request.GiamGiaChiTietSanPhamDto;
import com.example.demo.dto.request.GiamGiaChiTietSanPhamRequest;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.GiamGiaChiTietSanPhamEntity;
import com.example.demo.entity.GiamGiaSanPhamEntity;
import com.example.demo.entity.GiayChiTietEntity;
import com.example.demo.repository.GiamGiaChiTietSanPhamRepository;
import com.example.demo.repository.GiamGiaSanPhamRepository;
import com.example.demo.repository.GiayChiTietRepository;
import com.example.demo.repository.GiayRepository;
import com.example.demo.service.GiamGiaChiTietSanPhamService;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GiamGiaChiTietSanPhamServiceImpl implements GiamGiaChiTietSanPhamService {
  private final GiamGiaChiTietSanPhamRepository giamGiaChiTietSanPhamRepository;
  private final GiayRepository giayRepository;
  private final GiamGiaSanPhamRepository giamGiaSanPhamRepository;
  private final GiayChiTietRepository giayChiTietRepository;

  @Override
  public List<GiamGiaChiTietSanPhamEntity> getAll() {
    return giamGiaChiTietSanPhamRepository.findAll();
  }

  @Override
  public GiamGiaChiTietSanPhamEntity add(GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto) {
    return giamGiaChiTietSanPhamRepository.save(
        GiamGiaChiTietSanPhamEntity.builder()
            .soTienDaGiam(giamGiaChiTietSanPhamDto.getSoTienDaGiam())
            .trangThai(giamGiaChiTietSanPhamDto.getTrangThai())
            .giayChiTiet(
                giayChiTietRepository.findById(giamGiaChiTietSanPhamDto.getGiayDto().getId()).orElse(null))
            .chuongTrinhGiamSanPhamEntity(
                giamGiaSanPhamRepository
                    .findById(giamGiaChiTietSanPhamDto.getGiamGiaSanPhamDto().getId())
                    .orElse(null))
            .build());
  }

  @Override
  public GiamGiaChiTietSanPhamEntity update(GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto) {
    Optional<GiamGiaChiTietSanPhamEntity> optional =
        giamGiaChiTietSanPhamRepository.findById(giamGiaChiTietSanPhamDto.getId());
    return optional
        .map(
            o -> {
              o.setSoTienDaGiam(giamGiaChiTietSanPhamDto.getSoTienDaGiam());
              o.setTrangThai(giamGiaChiTietSanPhamDto.getTrangThai());
              o.setGiayChiTiet(
                  giayChiTietRepository
                      .findById(giamGiaChiTietSanPhamDto.getGiayDto().getId())
                      .orElse(null));
              o.setChuongTrinhGiamSanPhamEntity(
                  giamGiaSanPhamRepository
                      .findById(giamGiaChiTietSanPhamDto.getGiamGiaSanPhamDto().getId())
                      .orElse(null));
              return giamGiaChiTietSanPhamRepository.save(o);
            })
        .orElse(null);
  }

  @Override
  public GiamGiaChiTietSanPhamEntity detail(GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto) {
    Optional<GiamGiaChiTietSanPhamEntity> optional =
        giamGiaChiTietSanPhamRepository.findById(giamGiaChiTietSanPhamDto.getId());
    return optional.orElse(null);
  }

  @Override
  public GiamGiaChiTietSanPhamEntity delete(GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto) {
    Optional<GiamGiaChiTietSanPhamEntity> optional =
        giamGiaChiTietSanPhamRepository.findById(giamGiaChiTietSanPhamDto.getId());
    return optional
        .map(
            o -> {
              giamGiaChiTietSanPhamRepository.delete(o);
              return o;
            })
        .orElse(null);
  }

  @Override
  public PageResponse<GiamGiaChiTietSanPhamEntity> findByPagingCriteria(
      GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto, Pageable pageable) {
    Page<GiamGiaChiTietSanPhamEntity> page =
        giamGiaChiTietSanPhamRepository.findAll(
            new Specification<GiamGiaChiTietSanPhamEntity>() {
              @Override
              public Predicate toPredicate(
                  Root<GiamGiaChiTietSanPhamEntity> root,
                  CriteriaQuery<?> query,
                  CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();
                if (giamGiaChiTietSanPhamDto != null) {
                  // Kiểm tra điều kiện cho "trangThai"
                  if (giamGiaChiTietSanPhamDto.getTrangThai() != null) {
                    predicates.add(
                        criteriaBuilder.equal(
                            root.get("trangThai"), giamGiaChiTietSanPhamDto.getTrangThai()));
                  }

                  // Kiểm tra điều kiện cho "soTienDaGiam"
                  if (giamGiaChiTietSanPhamDto.getSoTienDaGiam() != null) {
                    predicates.add(
                        criteriaBuilder.equal(
                            root.get("soTienDaGiam"), giamGiaChiTietSanPhamDto.getSoTienDaGiam()));
                  }
                }
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
              }
            },
            pageable);
    PageResponse<GiamGiaChiTietSanPhamEntity> pageResponse = new PageResponse<>();
    pageResponse.setTotalElements((int) page.getTotalElements());
    pageResponse.setTotalPages(page.getTotalPages());
    pageResponse.setSize(page.getSize());
    pageResponse.setPage(page.getNumber() + 1);
    pageResponse.setContent(page.getContent());

    return pageResponse;
  }
}
