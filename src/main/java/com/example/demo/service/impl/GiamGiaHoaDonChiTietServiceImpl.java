package com.example.demo.service.impl;

import com.example.demo.dto.request.GiamGiaHoaDonChiTietDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.ChuongTrinhGiamGiaHoaDonChiTietEntity;
import com.example.demo.repository.GiamGiaHoaDonChiTietRepository;
import com.example.demo.service.GiamGiaHoaDonChiTietService;
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
public class GiamGiaHoaDonChiTietServiceImpl implements GiamGiaHoaDonChiTietService {
    private final GiamGiaHoaDonChiTietRepository giamGiaHoaDonChiTietRepository;

    @Override
    public List<ChuongTrinhGiamGiaHoaDonChiTietEntity> getAll() {
        return giamGiaHoaDonChiTietRepository.findAll();
    }

    @Override
    public ChuongTrinhGiamGiaHoaDonChiTietEntity add(GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto) {
        return giamGiaHoaDonChiTietRepository.save(
                ChuongTrinhGiamGiaHoaDonChiTietEntity.builder()
                        .tongTien(giamGiaHoaDonChiTietDto.getTongTien())
                        .soTienDaGiam(giamGiaHoaDonChiTietDto.getSoTienDaGiam())
                        .tongTienThanhToan(giamGiaHoaDonChiTietDto.getTongTienThanhToan())
                        .trangThai(giamGiaHoaDonChiTietDto.getTrangThai())
                        .build());
    }

    @Override
    public ChuongTrinhGiamGiaHoaDonChiTietEntity update(GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto) {
        Optional<ChuongTrinhGiamGiaHoaDonChiTietEntity> optional =
                giamGiaHoaDonChiTietRepository.findById(giamGiaHoaDonChiTietDto.getId());
        return optional
                .map(
                        o -> {
                            o.setTongTien(giamGiaHoaDonChiTietDto.getTongTien());
                            o.setSoTienDaGiam(giamGiaHoaDonChiTietDto.getSoTienDaGiam());
                            o.setTongTienThanhToan(giamGiaHoaDonChiTietDto.getTongTienThanhToan());

                            o.setTrangThai(giamGiaHoaDonChiTietDto.getTrangThai());
                            return giamGiaHoaDonChiTietRepository.save(o);
                        })
                .orElse(null);
    }

    @Override
    public ChuongTrinhGiamGiaHoaDonChiTietEntity detail(GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto) {
        Optional<ChuongTrinhGiamGiaHoaDonChiTietEntity> optional =
                giamGiaHoaDonChiTietRepository.findById(giamGiaHoaDonChiTietDto.getId());
        return optional.orElse(null);
    }

    @Override
    public ChuongTrinhGiamGiaHoaDonChiTietEntity delete(GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto) {
        Optional<ChuongTrinhGiamGiaHoaDonChiTietEntity> optional =
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
    public PageResponse<ChuongTrinhGiamGiaHoaDonChiTietEntity> findByPagingCriteria(
            GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto, Pageable pageable) {
        Page<ChuongTrinhGiamGiaHoaDonChiTietEntity> page =
                giamGiaHoaDonChiTietRepository.findAll(
                        new Specification<ChuongTrinhGiamGiaHoaDonChiTietEntity>() {
                            @Override
                            public Predicate toPredicate(
                                    Root<ChuongTrinhGiamGiaHoaDonChiTietEntity> root,
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
                                                        root.get("tongTienThanhToan"), giamGiaHoaDonChiTietDto.getTongTienThanhToan()));
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
        PageResponse<ChuongTrinhGiamGiaHoaDonChiTietEntity> pageResponse = new PageResponse<>();
        pageResponse.setTotalElements((int) page.getTotalElements());
        pageResponse.setTotalPages(page.getTotalPages());
        pageResponse.setSize(page.getSize());
        pageResponse.setPage(page.getNumber() + 1);
        pageResponse.setContent(page.getContent());

        return pageResponse;
    }
}
