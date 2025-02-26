package com.example.demo.service.impl;

import com.example.demo.dto.request.GiayChiTietDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.AnhGiayEntity;
import com.example.demo.entity.GiayChiTietEntity;
import com.example.demo.entity.GiayEntity;
import com.example.demo.repository.*;
import com.example.demo.service.AnhGiayService;
import com.example.demo.service.GiayChiTietService;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import lombok.NonNull;
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
  private final AnhGiayRepository anhGiayRepository;
    private final AnhGiayService anhGiayService;

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
                      .mauSacEntity(
                              giayChiTietDto.getMauSacDto() != null ?
                                      mauSacRepository.findById(giayChiTietDto.getMauSacDto().getId()).orElse(null) :
                                      null
                      )
                      .kichCoEntity(
                              giayChiTietDto.getKichCoDto() != null ?
                                      kichCoRepository.findById(giayChiTietDto.getKichCoDto().getId()).orElse(null) :
                                      null
                      )
                      .trangThai(giayChiTietDto.getTrangThai())
                      .giayEntity(
                              giayChiTietDto.getGiayDto() != null ?
                                      giayRepository.findById(giayChiTietDto.getGiayDto().getId()).orElse(null) :
                                      null
                      )
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
                  mauSacRepository.findById(giayChiTietDto.getMauSacDto().getId()).orElse(null));
              o.setKichCoEntity(
                  kichCoRepository.findById(giayChiTietDto.getKichCoDto().getId()).orElse(null));
              o.setTrangThai(giayChiTietDto.getTrangThai());
              o.setGiayEntity(giayRepository.findById(giayChiTietDto.getGiayDto().getId()).orElse(null));
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

    @Override
    public GiayChiTietEntity assignAnhGiay(@NonNull UUID id, @NonNull List<UUID> anhGiayIds) {

        anhGiayService.assignToGiayChiTietByAnhGiayIdAndIds(id, anhGiayIds);

        return giayChiTietRepository.findById(id).orElse(null);
    }

    @Override
    public List<GiayChiTietEntity> getAllGiayChiTietByGiayId(UUID giayId) {
        System.out.println("Fetching giay_chi_tiet with id_giay = " + giayId);
        List<GiayChiTietEntity> list = giayChiTietRepository.findByGiayEntityId(giayId);
        System.out.println("Result: " + list.size() + " items found.");
        return list;
    }



}
