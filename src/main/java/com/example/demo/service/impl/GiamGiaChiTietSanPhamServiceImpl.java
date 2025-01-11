package com.example.demo.service.impl;

import com.example.demo.dto.request.GiamGiaChiTietSanPhamDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.ChuongTrinhGiamGiaChiTietSanPhamEntity;
import com.example.demo.repository.GiamGiaChiTietSanPhamRepository;
import com.example.demo.service.GiamGiaChiTietSanPhamService;
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
public class GiamGiaChiTietSanPhamServiceImpl implements GiamGiaChiTietSanPhamService {
  private final GiamGiaChiTietSanPhamRepository giamGiaChiTietSanPhamRepository;

  @Override
  public List<ChuongTrinhGiamGiaChiTietSanPhamEntity> getAll() {
    return giamGiaChiTietSanPhamRepository.findAll();
  }

  @Override
  public ChuongTrinhGiamGiaChiTietSanPhamEntity add(
      GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto) {
    return giamGiaChiTietSanPhamRepository.save(
        ChuongTrinhGiamGiaChiTietSanPhamEntity.builder()
            .soTienDaGiam(giamGiaChiTietSanPhamDto.getSoTienDaGiam())
            .trangThai(giamGiaChiTietSanPhamDto.getTrangThai())
            .build());
  }

  @Override
  public ChuongTrinhGiamGiaChiTietSanPhamEntity update(
          GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto) {
    Optional<ChuongTrinhGiamGiaChiTietSanPhamEntity> optional =
        giamGiaChiTietSanPhamRepository.findById(giamGiaChiTietSanPhamDto.getId());
    return optional
        .map(
            o -> {
              o.setSoTienDaGiam(giamGiaChiTietSanPhamDto.getSoTienDaGiam());
              o.setTrangThai(giamGiaChiTietSanPhamDto.getTrangThai());
              return giamGiaChiTietSanPhamRepository.save(o);
            })
        .orElse(null);
  }

  @Override
  public ChuongTrinhGiamGiaChiTietSanPhamEntity detail(
          GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto) {
    Optional<ChuongTrinhGiamGiaChiTietSanPhamEntity> optional =
        giamGiaChiTietSanPhamRepository.findById(giamGiaChiTietSanPhamDto.getId());
    return optional.orElse(null);
  }

  @Override
  public ChuongTrinhGiamGiaChiTietSanPhamEntity delete(
          GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto) {
    Optional<ChuongTrinhGiamGiaChiTietSanPhamEntity> optional =
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
  public PageResponse<ChuongTrinhGiamGiaChiTietSanPhamEntity> findByPagingCriteria(
      GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto, Pageable pageable) {
    Page<ChuongTrinhGiamGiaChiTietSanPhamEntity> page =
        giamGiaChiTietSanPhamRepository.findAll(
            new Specification<ChuongTrinhGiamGiaChiTietSanPhamEntity>() {
              @Override
              public Predicate toPredicate(
                  Root<ChuongTrinhGiamGiaChiTietSanPhamEntity> root,
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
    PageResponse<ChuongTrinhGiamGiaChiTietSanPhamEntity> pageResponse = new PageResponse<>();
    pageResponse.setTotalElements((int) page.getTotalElements());
    pageResponse.setTotalPages(page.getTotalPages());
    pageResponse.setSize(page.getSize());
    pageResponse.setPage(page.getNumber() + 1);
    pageResponse.setContent(page.getContent());

    return pageResponse;
  }
}
