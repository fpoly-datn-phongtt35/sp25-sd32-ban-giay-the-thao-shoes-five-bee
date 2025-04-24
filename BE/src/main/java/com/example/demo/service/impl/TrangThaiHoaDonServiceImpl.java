package com.example.demo.service.impl;

import com.example.demo.dto.request.HoaDonDto;
import com.example.demo.dto.request.UserDto;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.service.LichSuHoaDonService;
import com.example.demo.service.SendMailService;
import com.example.demo.service.TrangThaiHoaDonService;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import java.io.ByteArrayOutputStream;
import java.util.*;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class TrangThaiHoaDonServiceImpl implements TrangThaiHoaDonService {
  @Autowired private HoaDonRepository hoaDonRepository;
  @Autowired private GioHangChiTietRepository gioHangChiTietRepository;
  @Autowired private GiayChiTietRepository giayChiTietRepository;
  @Autowired private GiayRepository giayRepository;
  @Autowired private LichSuHoaDonService lichSuHoaDonService;
  @Autowired private UserRepository userRepository;
  @Autowired private SendMailService sendMailService;
  @Autowired private HoaDonChiTietRepository hoaDonChiTietRepository;

  @Override
  public HoaDonEntity xacNhanHoaDon(UUID id) {
    Optional<HoaDonEntity> hoaDonOpt = hoaDonRepository.findById(id);

    if (hoaDonOpt.isEmpty()) {
      throw new RuntimeException("Không tìm thấy hóa đơn với ID: " + id);
    }

    HoaDonEntity hoaDon = hoaDonOpt.get();
    int currentStatus = hoaDon.getTrangThai();

    // Không thể cập nhật nếu hóa đơn đã hoàn thành hoặc bị hủy
    if (currentStatus == 2) {
      throw new RuntimeException("Hóa đơn đã hoàn thành, không thể xác nhận tiếp.");
    }
    if (currentStatus == 8) {
      throw new RuntimeException("Hóa đơn đã bị hủy, không thể xác nhận tiếp.");
    }
    List<HoaDonChiTietEntity> hoaDonChiTietEntities = new ArrayList<>();


    // Chuyển đổi trạng thái theo luồng hợp lý
    switch (currentStatus) {
      case 0:
        hoaDon.setTrangThai(3); // Chờ xác nhận → Đã xác nhận
        // Trừ số lượng tồn kho khi chuyển từ "Chờ xác nhận" sang "Đã xác nhận"
        updateStockAfterOrderConfirmed(hoaDon);
        hoaDonChiTietEntities=hoaDon.getItems();

        lichSuHoaDonService.createLichSuHoaDon(id, 3, 0);
        break;
      case 3:
        hoaDon.setTrangThai(4); // Đã xác nhận → Chờ vận chuyển
        lichSuHoaDonService.createLichSuHoaDon(id, 4, 3);
        break;
      case 4:
        hoaDon.setTrangThai(5); // Chờ vận chuyển → Đang vận chuyển
        lichSuHoaDonService.createLichSuHoaDon(id, 5, 4);
        break;
      case 5:
        hoaDon.setTrangThai(6); // Đang vận chuyển → Đã giao hàng
        lichSuHoaDonService.createLichSuHoaDon(id, 6, 5);
        break;
      case 6:
        hoaDon.setTrangThai(2); // Đã giao hàng → Hoàn thành
        lichSuHoaDonService.createLichSuHoaDon(id, 2, 6);

        // Tìm tất cả hoá đơn chi tiết theo hóa đơn hiện tại
        List<HoaDonChiTietEntity> hoaDonChiTietList =
            hoaDonChiTietRepository.findAllByHoaDonEntity_Id(id);

        // Cập nhật trạng thái của tất cả hóa đơn chi tiết về hoàn thành
        hoaDonChiTietList.forEach(hdct -> hdct.setTrangThai(2));

        // Lưu lại trạng thái đã cập nhật
        hoaDonChiTietRepository.saveAll(hoaDonChiTietList);

        // Gửi email đánh giá khi đơn hàng hoàn thành
        sendDanhGiaEmail(hoaDon.getUserEntity().getId(), hoaDon.getId());
        break;
      default:
        throw new RuntimeException("Trạng thái hiện tại không thể xác nhận tiếp.");
    }
    hoaDonRepository.save(hoaDon);
    hoaDonChiTietEntities.forEach((hdct)->{
      sendEmail(hdct.getGiayChiTietEntity());
    });
    return hoaDon;
  }

  private void sendEmail(GiayChiTietEntity gct) {
    gct.getHoaDonChiTietEntities().forEach(hdct -> {
      if (hdct.getSoLuong() > gct.getSoLuongTon() && hdct.getHoaDonEntity().getTrangThai() == 0) {
        String email = hdct.getHoaDonEntity().getUserEntity().getEmail();
        String tenSanPham = gct.getGiayEntity().getTen();
        int soLuongDat = hdct.getSoLuong();
        int soLuongTon = gct.getSoLuongTon();
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
                .append(tenSanPham).append("</strong>\", nhưng hiện kho chỉ còn <strong>")
                .append(soLuongTon).append("</strong> sản phẩm.</p>");
        emailContent.append("<p>Vui lòng chọn một trong hai lựa chọn dưới đây để tiếp tục xử lý đơn hàng của bạn:</p>");
        emailContent.append("</td>");
        emailContent.append("</tr>");
        emailContent.append("</table>");

        // Action buttons table
        emailContent.append("<table align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"max-width:580px;width:100%;margin:0 auto 20px;border-collapse:collapse;\">");
        emailContent.append("<tr>");
        emailContent.append("<th style=\"text-align:center;padding:15px;background-color:#f8f8f8;border-bottom:2px solid #1D70B8;\">Hành động</th>");
        emailContent.append("</tr>");
        emailContent.append("<tr>");
        emailContent.append("<td style=\"padding:15px;border-bottom:1px solid #dddddd;text-align:center;\">");
        emailContent.append("<a href=\"http://localhost:3000/orderStatusPage?action=wait&orderId=").append(maHoaDon)
                .append("\" style=\"display:inline-block;padding:10px 20px;background-color:#1D70B8;color:#ffffff;text-decoration:none;border-radius:5px;font-weight:bold;margin-right:10px;\">")
                .append("Chờ nhập hàng</a>");
        emailContent.append("<a href=\"http://localhost:3000/orderStatusPage?action=cancel&orderId=").append(maHoaDon)
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

        sendMailService.sendMail(email, subject, emailContent.toString());
      }
    });
  }

  // Giảm số lượng tồn kho khi trạng thái hóa đơn được xác nhận
  private void updateStockAfterOrderConfirmed(HoaDonEntity hoaDon) {
    for (HoaDonChiTietEntity item : hoaDon.getItems()) {
      GiayChiTietEntity giayChiTiet = item.getGiayChiTietEntity();
      int remainingStock = giayChiTiet.getSoLuongTon() - item.getSoLuong();

      if (remainingStock < 0) {
        throw new RuntimeException(
            "Sản phẩm " + giayChiTiet.getMaVach() + " không đủ số lượng trong kho.");
      }

      giayChiTiet.setSoLuongTon(remainingStock);
      giayChiTietRepository.save(giayChiTiet);

      updateTotalStock(giayChiTiet.getGiayEntity().getId());
    }
  }

  private void updateTotalStock(UUID idGiayEntity) {
    List<GiayChiTietEntity> giayChiTietEntities =
        giayChiTietRepository.findByGiayEntityId(idGiayEntity);

    int totalStock = giayChiTietEntities.stream().mapToInt(GiayChiTietEntity::getSoLuongTon).sum();
    GiayEntity giayEntity =
        giayRepository
            .findById(idGiayEntity)
            .orElseThrow(() -> new RuntimeException("không tìm thấy sản phẩm "));
    giayEntity.setSoLuongTon(totalStock);
    giayRepository.save(giayEntity);
  }

  @Override
  public HoaDonEntity huyHoaDon(UUID id) {
    Optional<HoaDonEntity> hoaDonOpt = hoaDonRepository.findById(id);
    if (hoaDonOpt.isPresent()) {
      HoaDonEntity hoaDon = hoaDonOpt.get();
      lichSuHoaDonService.createLichSuHoaDon(id, 8, hoaDon.getTrangThai());
      hoaDon.setTrangThai(8); // Đã hủy
      return hoaDonRepository.save(hoaDon);
    } else {
      throw new RuntimeException("Không tìm thấy hóa đơn với ID: " + id);
    }
  }

  @Override
  public List<HoaDonDto> getAllHoaDon() {
    List<HoaDonEntity> hoaDons = hoaDonRepository.findAll();
    // sắp xếp hóa đơn
    Collections.sort(
        hoaDons,
        (hd1, hd2) -> {
          boolean hd1IsOnlineWaiting =
              (hd1.getHinhThucThanhToan() != null && hd1.getHinhThucThanhToan() == 2)
                  && hd1.getTrangThai() == 0;
          boolean hd2IsOnlineWaiting =
              (hd2.getHinhThucThanhToan() != null && hd2.getHinhThucThanhToan() == 2)
                  && hd2.getTrangThai() == 0;

          // nếu hd1 là online và chờ xác nhận và hd2 không phải
          if (hd1IsOnlineWaiting && !hd2IsOnlineWaiting) {
            return -1;
          }

          // nếu hd2 là online và chờ xác nhận , hd1 không phải
          if (hd2IsOnlineWaiting && !hd1IsOnlineWaiting) {
            return 1;
          }

          // nếu hai hóa đơn cùng là hoặc đều không là online + chờ xác nhận, kiểm tra đã thanh toán
          if (hd1.getNgayThanhToan() != null && hd2.getNgayThanhToan() == null) {
            return -1; // hd1 lên trước
          }

          if (hd2.getNgayThanhToan() != null && hd1.getNgayThanhToan() == null) {
            return 1; // hd2 lên trước
          }

          // nếu cả hai cùng trạng thái thanh toán, sắp xếp theo ngày tạo mới nhất
          return hd2.getNgayTao().compareTo(hd1.getNgayTao());
        });

    return hoaDons.stream()
        .map(
            hd -> {
              UserDto userDto = null;
              if (hd.getUserEntity() != null) {
                try {
                  userDto =
                      new UserDto(
                          hd.getUserEntity().getId(),
                          null, // Không cần ảnh
                          hd.getUserEntity().getHoTen(),
                          null, // Không cần ngày sinh
                          hd.getUserEntity().getSoDienThoai(),
                          hd.getUserEntity().getEmail(),
                          null, // Không cần mật khẩu
                          null, // Không cần isEnabled
                          null, // Không cần roleNames
                          null // Không cần địa chỉ
                          );
                } catch (Exception e) {
                  // Xử lý trường hợp không thể truy cập thông tin người dùng
                  userDto =
                      new UserDto(
                          UUID.fromString("00000000-0000-0000-0000-000000000000"),
                          null,
                          "Người dùng không tồn tại",
                          null,
                          "N/A",
                          "N/A",
                          null,
                          null,
                          null,
                          null);
                }
              }

              return new HoaDonDto(
                  hd.getId(),
                  hd.getMa(),
                  hd.getNgayTao(),
                  hd.getNgayThanhToan(),
                  hd.getMoTa(),
                  hd.getTenNguoiNhan(),
                  hd.getSdtNguoiNhan(),
                  hd.getEmail(),
                  hd.getXa(),
                  hd.getHuyen(),
                  hd.getTinh(),
                  hd.getDiaChi(),
                  hd.getTongTien(),
                  hd.getHinhThucMua(),
                  hd.getHinhThucThanhToan(),
                  hd.getHinhThucNhanHang(),
                  hd.getSoTienGiam(),
                  hd.getPhiShip(),
                  hd.getTrangThai(),
                  userDto);
            })
        .collect(Collectors.toList());
  }

  @Override
  public HoaDonEntity findById(UUID id) {
    return hoaDonRepository.findById(id).orElse(null);
  }

  @Override
  public byte[] printHoaDon(UUID id) {
    Optional<HoaDonEntity> optional = hoaDonRepository.findById(id);
    if (optional.isPresent()) {
      HoaDonEntity hoaDonEntity = optional.get();
      ByteArrayOutputStream hoaDon1 = new ByteArrayOutputStream();
      PdfWriter writer = new PdfWriter(hoaDon1);
      PdfDocument pdfDocument = new PdfDocument(writer);
      Document document = new Document(pdfDocument);
      document.add(new Paragraph("HOA DON MUA HÀNG :"));
      document.add(new Paragraph("MA HOA DON :" + hoaDonEntity.getMa()));
      document.add(new Paragraph("TEN KHACH HANG :" + hoaDonEntity.getUserEntity().getHoTen()));
      document.add(new Paragraph(("NGAY TAO :" + hoaDonEntity.getNgayTao())));
      document.add(
          new Paragraph("SO DIEN THOAI :" + hoaDonEntity.getUserEntity().getSoDienThoai()));
      document.add(new Paragraph("TONG TIEN :" + hoaDonEntity.getTongTien()));
      document.close();
      return hoaDon1.toByteArray();
    }
    return null;
  }

  public void sendDanhGiaEmail(UUID userId, UUID hoaDonId) {
    UserEntity userEntity =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new RuntimeException("không tìm thấy user"));
    String email = userEntity.getEmail();
    String subject = "Mời bạn đánh giá đơn hàng #" + hoaDonId;
    String body =
        "Chào "
            + userEntity.getHoTen()
            + ",\n\n"
            + "Cảm ơn bạn đã mua hàng! Đơn hàng của bạn đã hoàn thành. "
            + "Vui lòng để lại đánh giá về sản phẩm tại đường dẫn sau:\n"
            + "http://your-frontend.com/danh-gia/"
            + hoaDonId
            + "\n\n"
            + "Trân trọng,\nĐội ngũ hỗ trợ khách hàng.";

    sendMailService.sendMail(email, subject, body);
  }

  @Override
  public List<HoaDonEntity> getHoaDonByUserId(UUID userId) {
    return hoaDonRepository.findByUserId(userId);
  }
}
