package com.example.demo.service.impl;

import com.example.demo.dto.request.AnhGiayDto;
import com.example.demo.dto.request.GiayChiTietDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.GiayChiTietEntity;
import com.example.demo.entity.GiayEntity;
import com.example.demo.repository.*;
import com.example.demo.service.AnhGiayService;
import com.example.demo.service.GiayChiTietService;
import com.example.demo.service.SendMailService;
import com.example.demo.service.SubscriptionService;
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
import java.util.*;
import java.util.stream.Collectors;
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
  private final GiayServiceImpl giayServiceImpl;
  private final SubscriptionService subscriptionService;
  private final SendMailService sendMailService;

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
    int tongSoLuongBienThe = listBienThe.stream().mapToInt(GiayChiTietEntity::getSoLuongTon).sum();

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
    public List<GiayChiTietEntity> goiYSanPhamTuongTuTheoGiayId(UUID giayId) {
        GiayEntity giayEntity = giayRepository.findById(giayId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giày"));

        UUID danhMucId = giayEntity.getDanhMuc() != null ? giayEntity.getDanhMuc().getId() : null;
        UUID thuongHieuId = giayEntity.getThuongHieu() != null ? giayEntity.getThuongHieu().getId() : null;
        UUID kieuDangId = giayEntity.getKieuDang() != null ? giayEntity.getKieuDang().getId() : null;

        // Lấy danh sách tất cả ID của biến thể thuộc giày này
        List<UUID> excludedIds = giayEntity.getGiayChiTietEntities()
                .stream()
                .map(GiayChiTietEntity::getId)
                .collect(Collectors.toList());

        Set<GiayChiTietEntity> result = new LinkedHashSet<>();

        if (danhMucId != null && thuongHieuId != null && kieuDangId != null) {
            result.addAll(giayChiTietRepository.findSimilarProductsByGiay(danhMucId, thuongHieuId, kieuDangId, excludedIds));
        }

        if (thuongHieuId != null && danhMucId != null){
            result.addAll( giayChiTietRepository.findByThuongHieuAndDanhMuc(thuongHieuId,danhMucId , excludedIds));
        }

        if (danhMucId != null && kieuDangId != null){
            result.addAll( giayChiTietRepository.findByKieuDangAndDanhMuc(kieuDangId,danhMucId,excludedIds));
        }

        if (thuongHieuId != null && kieuDangId != null) {
            result.addAll( giayChiTietRepository.findByThuongHieuAndKieuDang(thuongHieuId, kieuDangId, excludedIds));
        }

        if (thuongHieuId != null) {
            result.addAll( giayChiTietRepository.findByThuongHieuAndNotCurrent(thuongHieuId, excludedIds));
        }

        if (kieuDangId != null) {
            result.addAll( giayChiTietRepository.findByKieuDangAndNotCurrent(kieuDangId, excludedIds));
        }

        if (danhMucId != null) {
            result.addAll( giayChiTietRepository.findByDanhMucAndNotCurrent(danhMucId, excludedIds));
        }

        return new ArrayList<>(result);
    }

    @Override
  public GiayChiTietEntity add(GiayChiTietDto giayChiTietDto) {
    GiayChiTietEntity giayChiTiet =
        GiayChiTietEntity.builder()
            .giaBan(giayChiTietDto.getGiaBan())
            .soLuongTon(giayChiTietDto.getSoLuongTon())
            .mauSacEntity(
                giayChiTietDto.getMauSacDto() != null
                    ? mauSacRepository.findById(giayChiTietDto.getMauSacDto().getId()).orElse(null)
                    : null)
            .kichCoEntity(
                giayChiTietDto.getKichCoDto() != null
                    ? kichCoRepository.findById(giayChiTietDto.getKichCoDto().getId()).orElse(null)
                    : null)
            .trangThai(giayChiTietDto.getTrangThai())
            .giayEntity(
                giayChiTietDto.getGiayDto() != null
                    ? giayRepository.findById(giayChiTietDto.getGiayDto().getId()).orElse(null)
                    : null)
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
    BitMatrix bitMatrix =
        new MultiFormatWriter().encode(maVach, BarcodeFormat.QR_CODE, width, height);
    Path path = FileSystems.getDefault().getPath(filePath);
    MatrixToImageWriter.writeToPath(bitMatrix, fileType, path);

    System.out.println("QR Code đã được lưu tại: " + filePath);
  } // tao QR o o D

  @Override
  public GiayChiTietEntity update(GiayChiTietDto giayChiTietDto) {
    Optional<GiayChiTietEntity> optional = giayChiTietRepository.findById(giayChiTietDto.getId());

    if (optional.isEmpty()){
        return null;
    }

    GiayChiTietEntity giayChiTietEntity = optional.get();
    int soLuongTonTruoc = giayChiTietEntity.getSoLuongTon();

    if (optional.get().getSoLuongTon() == 0) {
      subscriptionService.notifyAllCustomersAboutProduct(giayChiTietDto.getId());
    }

    return optional
        .map(
            o -> {
              o.setGiaBan(giayChiTietDto.getGiaBan());
              o.setSoLuongTon(giayChiTietDto.getSoLuongTon());

              // Cập nhật các thuộc tính liên quan nếu không null
              if (giayChiTietDto.getMauSacDto() != null) {
                o.setMauSacEntity(
                    mauSacRepository.findById(giayChiTietDto.getMauSacDto().getId()).orElse(null));
              }

              if (giayChiTietDto.getKichCoDto() != null) {
                o.setKichCoEntity(
                    kichCoRepository.findById(giayChiTietDto.getKichCoDto().getId()).orElse(null));
              }

              if (giayChiTietDto.getGiayDto() != null) {
                o.setGiayEntity(
                    giayRepository.findById(giayChiTietDto.getGiayDto().getId()).orElse(null));
              }


              o.setTrangThai(giayChiTietDto.getTrangThai());

              GiayEntity giay = o.getGiayEntity();
              if (giay != null) {
                List<GiayChiTietEntity> listBienThe =
                    giayChiTietRepository.findByGiayEntityId(giay.getId());

                int tongSoLuongBienThe =
                    listBienThe.stream().mapToInt(GiayChiTietEntity::getSoLuongTon).sum();

                giay.setSoLuongTon(tongSoLuongBienThe);
                giayRepository.save(giay);
              }
              UUID idGiay = giayChiTietDto.getId();
              List<UUID> ids =
                  giayChiTietDto.getAnhGiayDtos().stream()
                      .map(AnhGiayDto::getId)
                      .collect(Collectors.toList());
              if(!ids.isEmpty()) {
                  this.assignAnhGiay(idGiay, ids);
              }
              GiayChiTietEntity giayChiTietEntity1 = giayChiTietRepository.save(o);
                // sau khi cap nhật nếu số lượng tồn mới > 0 và trước đó là  0 -> sendMail
                if (soLuongTonTruoc == 0 && giayChiTietEntity1.getSoLuongTon() > 0){
                    sendEmail(giayChiTietEntity1);
                }
                return giayChiTietEntity1;
            }).orElse(null);
  }

    private void sendEmail(GiayChiTietEntity gct) {
        gct.getHoaDonChiTietEntities().forEach(hdct -> {
            int soLuongDat = hdct.getSoLuong();
            int soLuongTon = gct.getSoLuongTon();

            if (soLuongTon >= soLuongDat && hdct.getHoaDonEntity().getTrangThai() == 9) {
                String email = hdct.getHoaDonEntity().getUserEntity().getEmail();
                String tenSanPham = gct.getGiayEntity().getTen();
                String maHoaDon = hdct.getHoaDonEntity().getMa();
                String tenNguoiDung = hdct.getHoaDonEntity().getUserEntity().getHoTen();

                String subject = "Thông báo về đơn hàng " + maHoaDon;

                StringBuilder emailContent = new StringBuilder();
                emailContent.append("<!DOCTYPE html>");
                emailContent.append("<html lang=\"vi\">");
                emailContent.append("<head>");
                emailContent.append("<meta charset=\"UTF-8\">");
                emailContent.append("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">");
                emailContent.append("</head>");
                emailContent.append("<body>");
                emailContent.append("<div style=\"font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#0b0c0c\">");

                // Header
                emailContent.append("<table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;min-width:100%;width:100%!important\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">");
                emailContent.append("<tr>");
                emailContent.append("<td bgcolor=\"#0b0c0c\" style=\"padding:20px;text-align:center;\">");
                emailContent.append("<span style=\"font-size:28px;line-height:1.3;color:#ffffff;font-weight:bold;\">Thông báo tình trạng đơn hàng</span>");
                emailContent.append("</td>");
                emailContent.append("</tr>");
                emailContent.append("</table>");

                // Body content
                emailContent.append("<table align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"max-width:580px;width:100%;margin:20px auto;\">");
                emailContent.append("<tr>");
                emailContent.append("<td style=\"font-size:19px;line-height:1.6;color:#0b0c0c;padding:10px 20px;\">");
                emailContent.append("<p>Chào <strong>").append(tenNguoiDung).append("</strong>,</p>");
                emailContent.append("<p>Bạn đã đặt <strong>").append(soLuongDat).append("</strong> sản phẩm \"<strong>")
                        .append(tenSanPham).append("</strong>\".</p>");
                emailContent.append("<p>Hiện kho đã có đủ hàng với <strong>")
                        .append(soLuongTon).append("</strong> sản phẩm có sẵn.</p>");
                emailContent.append("<p>Vui lòng chọn một trong hai lựa chọn dưới đây để tiếp tục xử lý đơn hàng của bạn:</p>");
                emailContent.append("</td>");
                emailContent.append("</tr>");
                emailContent.append("</table>");

                // Action buttons
                emailContent.append("<table align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"max-width:580px;width:100%;margin:0 auto 20px;border-collapse:collapse;\">");
                emailContent.append("<tr>");
                emailContent.append("<th style=\"text-align:center;padding:15px;background-color:#f8f8f8;border-bottom:2px solid #1D70B8;\">Hành động</th>");
                emailContent.append("</tr>");
                emailContent.append("<tr>");
                emailContent.append("<td style=\"padding:15px;border-bottom:1px solid #dddddd;text-align:center;\">");
                String feBaseUrl = "http://localhost:3000/orderStatusPage";

                emailContent.append("<a href=\"").append(feBaseUrl)
                        .append("?action=continue&orderId=").append(maHoaDon)
                        .append("\" style=\"display:inline-block;padding:10px 20px;background-color:#1D70B8;color:#ffffff;text-decoration:none;border-radius:5px;font-weight:bold;margin-right:10px;\">")
                        .append("Tiếp tục đơn hàng</a>");

                emailContent.append("<a href=\"").append(feBaseUrl)
                        .append("?action=cancel&orderId=").append(maHoaDon)
                        .append("\" style=\"display:inline-block;padding:10px 20px;background-color:#d9534f;color:#ffffff;text-decoration:none;border-radius:5px;font-weight:bold;\">")
                        .append("Hủy đơn hàng</a>");
                emailContent.append("</td>");
                emailContent.append("</tr>");
                emailContent.append("</table>");

                // Footer
                emailContent.append("<table align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"max-width:580px;width:100%;margin:20px auto;\">");
                emailContent.append("<tr>");
                emailContent.append("<td style=\"font-size:16px;line-height:1.6;color:#0b0c0c;padding:10px 20px;text-align:center;\">");
                emailContent.append("<p>Đơn hàng của bạn sẽ được giữ trong vòng 24 giờ nếu không có phản hồi.</p>");
                emailContent.append("<p>Trân trọng,<br>Đội ngũ bán hàng</p>");
                emailContent.append("</td>");
                emailContent.append("</tr>");
                emailContent.append("</table>");

                emailContent.append("</div>");
                emailContent.append("</body>");
                emailContent.append("</html>");

                sendMailService.sendMail(email, emailContent.toString(), subject);
            }
        });
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
  public List<GiayChiTietEntity> filterGiayChiTiet(
      UUID mauSacId, UUID kichCoId, UUID thuongHieuId) {
    if (mauSacId != null && kichCoId != null && thuongHieuId != null) {
      return giayChiTietRepository.findByMauSacEntityIdAndKichCoEntityIdAndGiayEntity_ThuongHieu_Id(
          mauSacId, kichCoId, thuongHieuId);
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
