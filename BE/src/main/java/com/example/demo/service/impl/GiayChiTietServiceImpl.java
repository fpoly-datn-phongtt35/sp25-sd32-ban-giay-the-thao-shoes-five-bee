package com.example.demo.service.impl;

import com.example.demo.dto.request.GiayChiTietDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.AnhGiayEntity;
import com.example.demo.entity.GiayChiTietEntity;
import com.example.demo.entity.GiayEntity;
import com.example.demo.repository.*;
import com.example.demo.service.AnhGiayService;
import com.example.demo.service.GiayChiTietService;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.FileSystems;
import java.nio.file.Path;
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
    public GiayChiTietEntity updateSoLuongVaGaiaBan(UUID id, Integer soLuong, BigDecimal giaBan) {
        GiayChiTietEntity giayChiTiet = giayChiTietRepository.findById(id).orElse(null);

        if (giayChiTiet == null) {
            throw new RuntimeException("Không tìm thấy giày chi tiết");
        }

        // Lấy sản phẩm gốc
        GiayEntity giay = giayChiTiet.getGiayEntity();

        if (giay == null) {
            throw new RuntimeException("Không tìm thấy sản phẩm");
        }

        // Cập nhật số lượng và giá bán của biến thể
        giayChiTiet.setSoLuongTon(soLuong);
        giayChiTiet.setGiaBan(giaBan);

        // Tính tổng số lượng của tất cả các biến thể
        List<GiayChiTietEntity> listBienThe = giayChiTietRepository.findByGiayEntityId(giay.getId());
        int tongSoLuongBienThe = listBienThe.stream()
                .mapToInt(GiayChiTietEntity::getSoLuongTon)
                .sum();

        // Cập nhật tổng số lượng cho sản phẩm
        giay.setSoLuongTon(tongSoLuongBienThe);

        // Lưu lại sản phẩm và biến thể
        giayRepository.save(giay);
        return giayChiTietRepository.save(giayChiTiet);
    }

  @Override
  public List<GiayChiTietEntity> getAll() {
    return giayChiTietRepository.findAll();
  }

  @Override
  public GiayChiTietEntity add(GiayChiTietDto giayChiTietDto) {
      GiayChiTietEntity giayChiTiet = GiayChiTietEntity.builder()
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
              .build();

      // Lưu vào database để lấy ID
      giayChiTiet = giayChiTietRepository.save(giayChiTiet);


      String maVach = giayChiTiet.getGiayEntity().getTen();
      giayChiTiet.setMaVach(maVach);

      // Lưu lại với maVach
      giayChiTiet = giayChiTietRepository.save(giayChiTiet);

      // Tạo ảnh QR
      try {
          generateQRCode(maVach);
      } catch (WriterException | IOException e) {
          throw new RuntimeException("Lỗi khi tạo mã QR: " + e.getMessage());
      }

      return giayChiTiet;
  }

    public void generateQRCode(String maVach) throws WriterException, IOException {
        int width = 300;
        int height = 300;
        String fileType = "png";
        String folderPath = "C:/QR/"; // Thư mục lưu QR Code
        String filePath = folderPath + maVach + ".png"; // Đường dẫn file QR

        // Tạo thư mục nếu chưa tồn tại
        File folder = new File(folderPath);
        if (!folder.exists()) {
            boolean isCreated = folder.mkdirs();
            if (!isCreated) {
                throw new IOException("Không thể tạo thư mục: " + folderPath);
            }
        }

        // Tạo mã QR
        BitMatrix bitMatrix = new MultiFormatWriter().encode(maVach, BarcodeFormat.QR_CODE, width, height);
        Path path = FileSystems.getDefault().getPath(filePath);
        MatrixToImageWriter.writeToPath(bitMatrix, fileType, path);

        System.out.println("QR Code đã được lưu tại: " + filePath);
    }// tao QR o o D

    @Override
    public GiayChiTietEntity update(GiayChiTietDto giayChiTietDto) {
        Optional<GiayChiTietEntity> optional = giayChiTietRepository.findById(giayChiTietDto.getId());

        return optional.map(o -> {
            o.setGiaBan(giayChiTietDto.getGiaBan());
            o.setSoLuongTon(giayChiTietDto.getSoLuongTon());

            // Cập nhật các thuộc tính liên quan nếu không null
            if (giayChiTietDto.getMauSacDto() != null) {
                o.setMauSacEntity(mauSacRepository.findById(giayChiTietDto.getMauSacDto().getId()).orElse(null));
            }

            if (giayChiTietDto.getKichCoDto() != null) {
                o.setKichCoEntity(kichCoRepository.findById(giayChiTietDto.getKichCoDto().getId()).orElse(null));
            }

            if (giayChiTietDto.getGiayDto() != null) {
                o.setGiayEntity(giayRepository.findById(giayChiTietDto.getGiayDto().getId()).orElse(null));
            }

            o.setTrangThai(giayChiTietDto.getTrangThai());

            GiayEntity giay = o.getGiayEntity();
            if (giay != null) {
                List<GiayChiTietEntity> listBienThe = giayChiTietRepository.findByGiayEntityId(giay.getId());

                int tongSoLuongBienThe = listBienThe.stream()
                        .mapToInt(GiayChiTietEntity::getSoLuongTon)
                        .sum();

                giay.setSoLuongTon(tongSoLuongBienThe);
                giayRepository.save(giay);
            }
            return giayChiTietRepository.save(o);
        }).orElse(null);
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
    @Override
    public List<GiayChiTietEntity> filterGiayChiTiet(UUID mauSacId, UUID kichCoId, UUID thuongHieuId) {
        if (mauSacId != null && kichCoId != null && thuongHieuId != null) {
            return giayChiTietRepository.findByMauSacEntityIdAndKichCoEntityIdAndGiayEntity_ThuongHieu_Id(mauSacId, kichCoId, thuongHieuId);
        } else if (mauSacId != null && kichCoId != null) {
            return giayChiTietRepository.findByMauSacEntityIdAndKichCoEntityId(mauSacId, kichCoId);
        } else if (mauSacId != null) {
            return giayChiTietRepository.findByMauSacEntityId(mauSacId);
        } else if (kichCoId != null) {
            return giayChiTietRepository.findByKichCoEntityId(kichCoId);
        } else if (thuongHieuId != null) {
            return giayChiTietRepository.findByGiayEntity_ThuongHieu_Id(thuongHieuId);
        } else {
            return giayChiTietRepository.findAll();
        }
    }


}
