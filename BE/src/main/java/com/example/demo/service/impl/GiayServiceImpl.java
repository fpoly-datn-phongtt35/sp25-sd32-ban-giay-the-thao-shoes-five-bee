package com.example.demo.service.impl;

import com.example.demo.dto.request.GiayDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.AnhGiayEntity;
import com.example.demo.entity.GiayEntity;
import com.example.demo.repository.*;
import com.example.demo.service.AnhGiayService;
import com.example.demo.service.GiayService;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GiayServiceImpl implements GiayService {
  private final GiayRepository giayRepository;
  private final ThuongHieuRepository thuongHieuRepository;
  private final DanhMucRepository danhMucRepository;
  private final ChatLieuRepository chatLieuRepository;
  private final DeGiayRepository deGiayRepository;
  private final XuatXuRepository xuatXuRepository;
  private final KieuDangRepository kieuDangRepository;
  private final AnhGiayRepository anhGiayRepository;

  private final AnhGiayService anhGiayService;

  @Override
  public List<GiayEntity> getAll() {
    return giayRepository.findAll();
  }

  @Override
  public GiayEntity add(GiayDto giayDto) {
      return giayRepository.save(
              GiayEntity.builder()
                      .ma(giayDto.getMa())
                      .ten(giayDto.getTen())
                      .moTa(giayDto.getMoTa())
                      .giaNhap(giayDto.getGiaNhap())
                      .giaBan(giayDto.getGiaBan())
                      .soLuongTon(giayDto.getSoLuongTon())
                      .trangThai(giayDto.getTrangThai())
                      .thuongHieu(giayDto.getThuongHieuDto() != null ?
                              thuongHieuRepository.findById(giayDto.getThuongHieuDto().getId()).orElse(null) : null)
                      .chatLieu(giayDto.getChatLieuDto() != null ?
                              chatLieuRepository.findById(giayDto.getChatLieuDto().getId()).orElse(null) : null)
                      .danhMuc(giayDto.getDanhMucDto() != null ?
                              danhMucRepository.findById(giayDto.getDanhMucDto().getId()).orElse(null) : null)
                      .deGiay(giayDto.getDeGiayDto() != null ?
                              deGiayRepository.findById(giayDto.getDeGiayDto().getId()).orElse(null) : null)
                      .xuatXu(giayDto.getXuatXuDto() != null ?
                              xuatXuRepository.findById(giayDto.getXuatXuDto().getId()).orElse(null) : null)
                      .kieuDang(giayDto.getKieuDangDto() != null ?
                              kieuDangRepository.findById(giayDto.getKieuDangDto().getId()).orElse(null) : null)
                      .build());
  }


    @Override
  public GiayEntity update(GiayDto giayDto) {
    Optional<GiayEntity> optional = giayRepository.findById(giayDto.getId());
    return optional
        .map(
            o -> {
              o.setMa(giayDto.getMa());
              o.setTen(giayDto.getTen());
              o.setMoTa(giayDto.getMoTa());
              o.setGiaNhap(giayDto.getGiaNhap());
              o.setGiaBan(giayDto.getGiaBan());
              o.setSoLuongTon(giayDto.getSoLuongTon());
              o.setTrangThai(giayDto.getTrangThai());
              o.setThuongHieu(
                  thuongHieuRepository.findById(giayDto.getThuongHieuDto().getId()).orElse(null));
              o.setChatLieu(chatLieuRepository.findById(giayDto.getChatLieuDto().getId()).orElse(null));
              o.setDeGiay(deGiayRepository.findById(giayDto.getDeGiayDto().getId()).orElse(null));
              o.setDanhMuc(danhMucRepository.findById(giayDto.getDanhMucDto().getId()).orElse(null));
              o.setXuatXu(xuatXuRepository.findById(giayDto.getXuatXuDto().getId()).orElse(null));
              o.setKieuDang(kieuDangRepository.findById(giayDto.getKieuDangDto().getId()).orElse(null));
              return giayRepository.save(o);
            })
        .orElse(null);
  }

  @Override
  public GiayEntity detail(GiayDto giayDto) {
    Optional<GiayEntity> optional = giayRepository.findById(giayDto.getId());
    return optional.orElse(null);
  }

  @Override
  public GiayEntity delete(GiayDto giayDto) {
    Optional<GiayEntity> optional = giayRepository.findById(giayDto.getId());
    return optional
        .map(
            o -> {
              giayRepository.delete(o);
              return o;
            })
        .orElse(null);
  }

  @Override
  public PageResponse<GiayEntity> findByPagingCriteria(GiayDto giayDto, Pageable pageable) {
    Page<GiayEntity> page =
        giayRepository.findAll(
            new Specification<GiayEntity>() {
              @Override
              public Predicate toPredicate(
                  Root<GiayEntity> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();
                if (giayDto != null) {
                  // Kiểm tra điều kiện cho "ma"
                  if (giayDto.getMa() != null && !giayDto.getMa().isEmpty()) {
                    predicates.add(
                        criteriaBuilder.like(root.get("ma"), "%" + giayDto.getMa() + "%"));
                  }

                  // Kiểm tra điều kiện cho "ten"
                  if (giayDto.getTen() != null && !giayDto.getTen().isEmpty()) {
                    predicates.add(
                        criteriaBuilder.like(root.get("ten"), "%" + giayDto.getTen() + "%"));
                  }

                  // Kiểm tra điều kiện cho "moTa"
                  if (giayDto.getMoTa() != null && !giayDto.getMoTa().isEmpty()) {
                    predicates.add(
                        criteriaBuilder.like(root.get("moTa"), "%" + giayDto.getMoTa() + "%"));
                  }

                  // Kiểm tra điều kiện cho "giaNhap"
                  if (giayDto.getGiaNhap() != null) {
                    predicates.add(
                        criteriaBuilder.equal(root.get("giaNhap"), giayDto.getGiaNhap()));
                  }

                  // Kiểm tra điều kiện cho "giaBan"
                  if (giayDto.getGiaBan() != null) {
                    predicates.add(criteriaBuilder.equal(root.get("giaBan"), giayDto.getGiaBan()));
                  }

                  // Kiểm tra điều kiện cho "soLuongTon"
                  if (giayDto.getSoLuongTon() != null) {
                    predicates.add(
                        criteriaBuilder.equal(root.get("soLuongTon"), giayDto.getSoLuongTon()));
                  }

                  // Kiểm tra điều kiện cho "trangThai"
                  if (giayDto.getTrangThai() != null) {
                    predicates.add(
                        criteriaBuilder.equal(root.get("trangThai"), giayDto.getTrangThai()));
                  }
                }
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
              }
            },
            pageable);
    PageResponse<GiayEntity> pageResponse = new PageResponse<>();
    pageResponse.setTotalElements((int) page.getTotalElements());
    pageResponse.setTotalPages(page.getTotalPages());
    pageResponse.setSize(page.getSize());
    pageResponse.setPage(page.getNumber() + 1);
    pageResponse.setContent(page.getContent());

    return pageResponse;
  }


    @Override
    public GiayEntity assignAnhGiay(@NonNull UUID id, @NonNull List<UUID> anhGiayIds) {

        anhGiayService.assignToGiayByAnhGiayIdAndIds(id, anhGiayIds);

        return giayRepository.findById(id).orElse(null);

    }


}
