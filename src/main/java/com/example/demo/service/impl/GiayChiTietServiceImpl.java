package com.example.demo.service.impl;

import com.example.demo.dto.request.GiayChiTietDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.GiayChiTietEntity;
import com.example.demo.repository.GiayChiTietRepository;
import com.example.demo.repository.GiayRepository;
import com.example.demo.repository.KichCoRepository;
import com.example.demo.repository.MauSacRepository;
import com.example.demo.service.GiayChiTietService;
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
public class GiayChiTietServiceImpl implements GiayChiTietService {
  private final GiayChiTietRepository giayChiTietRepository;

  private final GiayRepository giayRepository;
  private final MauSacRepository mauSacRepository;
  private final KichCoRepository kichCoRepository;

  @Override
  public List<GiayChiTietEntity> getAll() {
    return giayChiTietRepository.findAll();
  }

  @Override
  public GiayChiTietEntity add(GiayChiTietDto giayChiTietDto) {
    return giayChiTietRepository.save(
        GiayChiTietEntity.builder()
            .giaBan(giayChiTietDto.getGiaBan())
            .soLuongTon(giayChiTietDto.getSoLuongTon())
            .mauSacEntity(mauSacRepository.findById(giayChiTietDto.getIdMauSac()).orElse(null))
            .kichCoEntity(kichCoRepository.findById(giayChiTietDto.getIdKichCo()).orElse(null))
            .trangThai(giayChiTietDto.getTrangThai())
            .giayEntity(giayRepository.findById(giayChiTietDto.getIdGiay()).orElse(null))
            .build());
  }

  @Override
  public GiayChiTietEntity update(GiayChiTietDto giayChiTietDto) {
    Optional<GiayChiTietEntity> optional = giayChiTietRepository.findById(giayChiTietDto.getId());
    return optional
        .map(
            o -> {
              o.setGiaBan(giayChiTietDto.getGiaBan());
              o.setSoLuongTon(giayChiTietDto.getSoLuongTon());
              o.setMauSacEntity(
                  mauSacRepository.findById(giayChiTietDto.getIdMauSac()).orElse(null));
              o.setKichCoEntity(
                  kichCoRepository.findById(giayChiTietDto.getIdKichCo()).orElse(null));
              o.setTrangThai(giayChiTietDto.getTrangThai());
              o.setGiayEntity(giayRepository.findById(giayChiTietDto.getIdGiay()).orElse(null));
              return giayChiTietRepository.save(o);
            })
        .orElse(null);
  }

  @Override
  public GiayChiTietEntity detail(GiayChiTietDto giayChiTietDto) {
    Optional<GiayChiTietEntity> optional = giayChiTietRepository.findById(giayChiTietDto.getId());
    return optional.orElse(null);
  }

  @Override
  public GiayChiTietEntity delete(GiayChiTietDto giayChiTietDto) {
    Optional<GiayChiTietEntity> optional = giayChiTietRepository.findById(giayChiTietDto.getId());
    return optional
        .map(
            o -> {
              giayChiTietRepository.delete(o);
              return o;
            })
        .orElse(null);
  }

  @Override
  public PageResponse<GiayChiTietEntity> findByPagingCriteria(
      GiayChiTietDto giayChiTietDto, Pageable pageable) {
    Page<GiayChiTietEntity> page =
        giayChiTietRepository.findAll(
            new Specification<GiayChiTietEntity>() {
              @Override
              public Predicate toPredicate(
                  Root<GiayChiTietEntity> root,
                  CriteriaQuery<?> query,
                  CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();
                if (giayChiTietDto != null) {
                  // Kiểm tra điều kiện cho "giaBan"
                  if (giayChiTietDto.getGiaBan() != null) {
                    predicates.add(
                        criteriaBuilder.equal(root.get("giaBan"), giayChiTietDto.getGiaBan()));
                  }

                  // Kiểm tra điều kiện cho "soLuongTon"
                  if (giayChiTietDto.getSoLuongTon() != null) {
                    predicates.add(
                        criteriaBuilder.equal(
                            root.get("soLuongTon"), giayChiTietDto.getSoLuongTon()));
                  }

                  // Kiểm tra điều kiện cho "trangThai"
                  if (giayChiTietDto.getTrangThai() != null) {
                    predicates.add(
                        criteriaBuilder.equal(
                            root.get("trangThai"), giayChiTietDto.getTrangThai()));
                  }
                }
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
              }
            },
            pageable);
    PageResponse<GiayChiTietEntity> pageResponse = new PageResponse<>();
    pageResponse.setTotalElements((int) page.getTotalElements());
    pageResponse.setTotalPages(page.getTotalPages());
    pageResponse.setSize(page.getSize());
    pageResponse.setPage(page.getNumber() + 1);
    pageResponse.setContent(page.getContent());

    return pageResponse;
  }
}
