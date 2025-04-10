package com.example.demo.service.impl;

import com.example.demo.dto.request.GiamGiaChiTietSanPhamRequest;
import com.example.demo.dto.request.GiamGiaSanPhamDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.GiamGiaChiTietSanPhamEntity;
import com.example.demo.entity.GiamGiaSanPhamEntity;
import com.example.demo.entity.GiayChiTietEntity;
import com.example.demo.repository.GiamGiaChiTietSanPhamRepository;
import com.example.demo.repository.GiamGiaSanPhamRepository;
import com.example.demo.repository.GiayChiTietRepository;
import com.example.demo.service.GiamGiaSanPhamService;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GiamGiaSanPhamServiceImpl implements GiamGiaSanPhamService {
  private final GiamGiaSanPhamRepository giamGiaSanPhamRepository;
  private final GiamGiaChiTietSanPhamRepository giamGiaChiTietSanPhamRepository;
  private final GiayChiTietRepository giayChiTietRepository;

  @Override
  public void updateTrangThaiGimGiaSanPham() {
    List<GiamGiaSanPhamEntity> danhSachGiamGia = giamGiaSanPhamRepository.findAll();
    Date now = new Date();

    danhSachGiamGia.forEach(
        gg -> {
          if (gg.getNgayKetThuc().before(now)) {
            gg.setTrangThai(1);

            List<GiayChiTietEntity> sanPhamBiAnhHuong =
                giamGiaChiTietSanPhamRepository
                    .findByGiayChiTietByGiamGiaSanPham(gg.getId())
                    .stream()
                    .map(GiamGiaChiTietSanPhamEntity::getGiayChiTiet)
                    .collect(Collectors.toList());

            for (GiayChiTietEntity sanPham : sanPhamBiAnhHuong) {
              List<GiamGiaChiTietSanPhamEntity> giamGiaGanNhat =
                  giamGiaChiTietSanPhamRepository.findByGiayChiTiet(sanPham.getId());

              if (!giamGiaGanNhat.isEmpty()) {
                if (giamGiaGanNhat.size() > 1) {
                  BigDecimal soTienDaGiam = giamGiaGanNhat.get(1).getSoTienDaGiam();
                  sanPham.setGiaKhiGiam(sanPham.getGiaBan().subtract(soTienDaGiam));
                } else if (giamGiaGanNhat.size() <= 1) {
                  sanPham.setGiaKhiGiam(BigDecimal.ZERO);
                }
              } else {
                sanPham.setGiaKhiGiam(null);
              }

              giayChiTietRepository.save(sanPham);
            }
          } else if (gg.getNgayBatDau().after(now)) {
            gg.setTrangThai(0);
          }
          giamGiaSanPhamRepository.save(gg);
        });
  }

  @Override
  public GiamGiaSanPhamEntity taoChuongTrinhGiamGia(
      GiamGiaChiTietSanPhamRequest giamGiaChiTietSanPhamRequest) {
    

    if (giamGiaChiTietSanPhamRequest.getPhanTramGiam() > 100) {
      throw new IllegalArgumentException("Phần trăm giảm không được vượt quá 100%.");
    }

    if (giamGiaChiTietSanPhamRequest.getNgayBatDau().after(giamGiaChiTietSanPhamRequest.getNgayKetThuc())) {
      throw new IllegalArgumentException("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
    }

    Integer trangThai;
    Date now = new Date();
    if (!now.before(giamGiaChiTietSanPhamRequest.getNgayBatDau())
        && !now.after(giamGiaChiTietSanPhamRequest.getNgayKetThuc())) {
      trangThai = 0;
    } else if (now.before(giamGiaChiTietSanPhamRequest.getNgayKetThuc())) {
      trangThai = 2;
    } else {
      trangThai = 1;
    }

    GiamGiaSanPhamEntity giamGiaSanPham =
        GiamGiaSanPhamEntity.builder()
            .ma(giamGiaChiTietSanPhamRequest.getMa())
            .ten(giamGiaChiTietSanPhamRequest.getTen())
            .phanTramGiam(giamGiaChiTietSanPhamRequest.getPhanTramGiam())
            .ngayBatDau(giamGiaChiTietSanPhamRequest.getNgayBatDau())
            .ngayKetThuc(giamGiaChiTietSanPhamRequest.getNgayKetThuc())
            .trangThai(trangThai)
            .build();
    giamGiaSanPhamRepository.save(giamGiaSanPham);

    List<GiayChiTietEntity> giayChiTietEntities =
        giayChiTietRepository.findGiayChiTietEntitiesByIds(
            giamGiaChiTietSanPhamRequest.getIdGiayChiTiet());

    // Áp dụng giảm giá
    giayChiTietEntities.forEach(
        sanPham -> {
          List<GiamGiaChiTietSanPhamEntity> giamGiaChiTietSanPhamEntity =
              giamGiaChiTietSanPhamRepository.findByGiayChiTiet(sanPham.getId());

          BigDecimal soTienDaGiam =
              sanPham
                  .getGiaBan()
                  .multiply(BigDecimal.valueOf(giamGiaChiTietSanPhamRequest.getPhanTramGiam()))
                  .divide(BigDecimal.valueOf(100), RoundingMode.HALF_UP);

          GiamGiaChiTietSanPhamEntity chiTietGiamGia =
              GiamGiaChiTietSanPhamEntity.builder()
                  .soTienDaGiam(soTienDaGiam)
                  .trangThai(trangThai)
                  .giayChiTiet(sanPham)
                  .ngayBatDau(giamGiaChiTietSanPhamRequest.getNgayBatDau())
                  .ngayKetThuc(giamGiaChiTietSanPhamRequest.getNgayKetThuc())
                  .chuongTrinhGiamSanPhamEntity(giamGiaSanPham)
                  .build();

          if (giamGiaChiTietSanPhamEntity.isEmpty()) {
            if (trangThai == 2) {
              sanPham.setGiaKhiGiam(BigDecimal.ZERO);
            } else {
              sanPham.setGiaKhiGiam(sanPham.getGiaBan().subtract(soTienDaGiam));
            }
          } else {
            if (giamGiaChiTietSanPhamRequest
                .getNgayBatDau()
                .before(giamGiaChiTietSanPhamEntity.get(0).getNgayBatDau())) {
              sanPham.setGiaKhiGiam(
                  sanPham
                      .getGiaBan()
                      .subtract(giamGiaChiTietSanPhamEntity.get(0).getSoTienDaGiam()));
            } else {
              sanPham.setGiaKhiGiam(sanPham.getGiaBan().subtract(soTienDaGiam));
            }
          }
          giayChiTietRepository.save(sanPham);
          giamGiaChiTietSanPhamRepository.save(chiTietGiamGia);
        });

    return giamGiaSanPham;
  }

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

  private String generateMa() {
    return "GG" + System.currentTimeMillis();
  }

  @Override
  public GiamGiaSanPhamEntity detail(GiamGiaSanPhamDto giamGiaSanPhamDto) {
    Optional<GiamGiaSanPhamEntity> optional =
        giamGiaSanPhamRepository.findById(giamGiaSanPhamDto.getId());
    return optional.orElse(null);
  }

  @Override
  public GiamGiaSanPhamEntity delete(GiamGiaSanPhamDto giamGiaSanPhamDto) {
    GiamGiaSanPhamEntity giamGiaSanPhamEntity =
        giamGiaSanPhamRepository.findById(giamGiaSanPhamDto.getId()).orElse(null);

    List<GiayChiTietEntity> sanPhamBiAnhHuong =
        giamGiaChiTietSanPhamRepository
            .findByGiayChiTietByGiamGiaSanPham(giamGiaSanPhamDto.getId())
            .stream()
            .map(GiamGiaChiTietSanPhamEntity::getGiayChiTiet)
            .collect(Collectors.toList());

    for (GiayChiTietEntity sanPham : sanPhamBiAnhHuong) {
      List<GiamGiaChiTietSanPhamEntity> giamGiaGanNhat =
          giamGiaChiTietSanPhamRepository.findByGiayChiTiet(sanPham.getId());

      if (!giamGiaGanNhat.isEmpty()) {
        if (giamGiaGanNhat.size() > 1) {
          BigDecimal soTienDaGiam = giamGiaGanNhat.get(1).getSoTienDaGiam();
          sanPham.setGiaKhiGiam(sanPham.getGiaBan().subtract(soTienDaGiam));
        } else if (giamGiaGanNhat.size() <= 1) {
          sanPham.setGiaKhiGiam(BigDecimal.ZERO);
        }
      } else {
        sanPham.setGiaKhiGiam(null);
      }

      giayChiTietRepository.save(sanPham);
    }
    giamGiaSanPhamRepository.delete(giamGiaSanPhamEntity);
    return giamGiaSanPhamEntity;
  }

  //
  //              giamGiaChiTietSanPhamRepository.deleteByGiamGiaSanPhamId(o.getId());
  //              giamGiaSanPhamRepository.deleteById(giamGiaSanPhamDto.getId());

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

  @Override
  public ByteArrayOutputStream exportExcel() throws IOException {
    List<GiamGiaSanPhamEntity> giamGiaSanPhamList = giamGiaSanPhamRepository.findAll();
    Workbook workbook = new XSSFWorkbook();
    Sheet sheet = workbook.createSheet("ChuongTrinhGiamGia");

    Row headerRow = sheet.createRow(0);
    String[] columns = {
      "ID", "Mã", "Tên", "Phần Trăm Giảm", "Ngày Bắt Đầu", "Ngày Kết Thúc", "Trạng Thái"
    };
    for (int i = 0; i < columns.length; i++) {
      Cell cell = headerRow.createCell(i);
      cell.setCellValue(columns[i]);
    }

    int rowNum = 1;
    for (GiamGiaSanPhamEntity entity : giamGiaSanPhamList) {
      Row row = sheet.createRow(rowNum++);
      row.createCell(0).setCellValue(entity.getId().toString());
      row.createCell(1).setCellValue(entity.getMa());
      row.createCell(2).setCellValue(entity.getTen());
      row.createCell(3).setCellValue(entity.getPhanTramGiam());
      row.createCell(4).setCellValue(entity.getNgayBatDau().toString());
      row.createCell(5).setCellValue(entity.getNgayKetThuc().toString());
      row.createCell(6).setCellValue(entity.getTrangThai());
    }

    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    workbook.write(baos);
    workbook.close();
    return baos;
  }

  @Override
  public List<GiamGiaSanPhamEntity> findByTen(String ten) {
    return giamGiaSanPhamRepository.findByTenContainingIgnoreCase(ten);
  }
}
