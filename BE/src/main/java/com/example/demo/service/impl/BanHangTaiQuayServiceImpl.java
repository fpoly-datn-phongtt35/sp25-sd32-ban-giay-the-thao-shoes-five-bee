package com.example.demo.service.impl;

import com.example.demo.dto.request.HoaDonRequest;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.service.BanHangTaiQuayService;
import com.example.demo.service.GiamGiaHoaDonChiTietService;
import com.example.demo.service.SendMailService;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BanHangTaiQuayServiceImpl implements BanHangTaiQuayService {

  private final GiamGiaHoaDonChiTietService giamGiaHoaDonChiTietService;
  private final HoaDonRepository hoaDonRepository;
  private final HoaDonChiTietRepository hoaDonChiTietRepository;
  private final GiayChiTietRepository giayChiTietRepository;
  private final GiamGiaChiTietSanPhamRepository giamGiaChiTietSanPhamRepository;
  private final UserRepository userRepository;
  private final GiamGiaHoaDonRepository giamGiaHoaDonRepository;
  private final GiayRepository giayRepository;
  private final SendMailService sendMailService;
  private final JavaMailSender javaMailSender;

  @Override
  public void thanhToanTaiQuay(
      UUID idHoaDon,
      UUID idGiamGia,
      Integer hinhThucThanhToan,
      Boolean isGiaoHang,
      HoaDonRequest hoaDonRequest) {

    HoaDonEntity hoaDon = hoaDonRepository.findById(idHoaDon)
            .orElseThrow(() -> new IllegalArgumentException("Hóa đơn không tồn tại"));

    // Kiểm tra người dùng đã mua hàng chưa
    List<UserEntity> users = userRepository.findBySoDienThoai(hoaDonRequest.getSdtNguoiNhan());
    UserEntity user = users.isEmpty() ? null : users.get(0);
    // Kiểm tra trạng thái hóa đơn
    if (hoaDon.getTrangThai() != 1) {
      throw new IllegalArgumentException("Hóa đơn đã được thanh toán hoặc không hợp lệ");
    }

    // Lấy danh sách sản phẩm trong hóa đơn
    List<HoaDonChiTietEntity> danhSachSanPham = hoaDonChiTietRepository.findByHoaDon(hoaDon);
    if (danhSachSanPham.isEmpty()) {
      throw new IllegalArgumentException("Không thể thanh toán hóa đơn trống");
    }

    // Tổng tiền sản phẩm gốc
    BigDecimal tongTienSanPhamGoc = danhSachSanPham.stream()
            .map(hdct -> hdct.getGiaBan().multiply(BigDecimal.valueOf(hdct.getSoLuong())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    // Tổng tiền sản phẩm khi có giảm giá sản phẩm
    BigDecimal tongTienSanPhamKhiGiam = danhSachSanPham.stream()
            .map(hdct -> hdct.getDonGia().multiply(BigDecimal.valueOf(hdct.getSoLuong())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    // Tính tiền giảm nếu có mã giảm giá
    BigDecimal soTienGiamKhiApMa = BigDecimal.ZERO;
    if (idGiamGia != null) {
      GiamGiaHoaDonEntity giamGia = giamGiaHoaDonRepository.findById(idGiamGia).orElse(null);
      if (giamGia != null &&
              giamGia.getSoLuong() > 0 &&
              tongTienSanPhamKhiGiam.compareTo(giamGia.getDieuKien()) >= 0 &&
              giamGia.getTrangThai() == 0) {

        soTienGiamKhiApMa = giamGiaHoaDonChiTietService.apDungPhieuGiamGia(
                idHoaDon, giamGia, tongTienSanPhamKhiGiam);
      }
    }

    BigDecimal soTienGiam = tongTienSanPhamGoc.subtract(tongTienSanPhamKhiGiam);
    BigDecimal phiShip = isGiaoHang ? BigDecimal.valueOf(0) : BigDecimal.ZERO;

    // Cập nhật thông tin hóa đơn
    hoaDon.setMa(hoaDonRequest.getMa());
    hoaDon.setNgayThanhToan(new Date());
    hoaDon.setMoTa(hoaDonRequest.getMoTa());
    hoaDon.setTenNguoiNhan(
            (user != null || hoaDonRequest.getTenNguoiNhan() != null)
                    ? hoaDonRequest.getTenNguoiNhan()
                    : "Khách lẻ");
    hoaDon.setSdtNguoiNhan(hoaDonRequest.getSdtNguoiNhan());
    hoaDon.setEmail(hoaDonRequest.getEmail());
    hoaDon.setXa(hoaDonRequest.getXa());
    hoaDon.setHuyen(hoaDonRequest.getHuyen());
    hoaDon.setTinh(hoaDonRequest.getTinh());
    hoaDon.setDiaChi(hoaDonRequest.getDiaChi());
    hoaDon.setTongTien(tongTienSanPhamKhiGiam.subtract(soTienGiamKhiApMa).add(phiShip));
    hoaDon.setHinhThucThanhToan(hinhThucThanhToan);
    hoaDon.setSoTienGiam(soTienGiam.add(soTienGiamKhiApMa));
    hoaDon.setPhiShip(phiShip);
    hoaDon.setHinhThucNhanHang(isGiaoHang ? 1 : 2);

    // Cập nhật trạng thái hóa đơn
    if (hinhThucThanhToan == 2) {
      hoaDon.setTrangThai(0);  // Chờ thanh toán khi giao hàng
    } else {
      hoaDon.setTrangThai(
              isGiaoHang
                      ? (hinhThucThanhToan == 0 || hinhThucThanhToan == 1 ? 3 : 2)
                      : 2
      );
    }

    // ✅ Cập nhật trạng thái hóa đơn chi tiết → 2 nếu là thanh toán tại quầy (0, 1) và không giao hàng
    if (!isGiaoHang && (hinhThucThanhToan == 0 || hinhThucThanhToan == 1)) {
      danhSachSanPham.forEach(hdct -> {
        hdct.setTrangThai(2); // 2 = Hoàn thành
        hoaDonChiTietRepository.save(hdct);
      });
    }

    // Trừ tồn kho nếu không phải "thanh toán khi giao hàng"
    if (hinhThucThanhToan != 2) {
      for (HoaDonChiTietEntity hdct : danhSachSanPham) {
        GiayChiTietEntity giayChiTiet = hdct.getGiayChiTietEntity();
        int soLuongMua = hdct.getSoLuong();

        if (giayChiTiet.getSoLuongTon() < soLuongMua) {
          throw new IllegalArgumentException("Sản phẩm " + giayChiTiet.getId() + " không đủ tồn kho");
        }

        giayChiTiet.setSoLuongTon(giayChiTiet.getSoLuongTon() - soLuongMua);
        giayChiTietRepository.save(giayChiTiet);

        GiayEntity giayEntity = giayChiTiet.getGiayEntity();
        if (giayEntity != null) {
          int tongMoi = giayEntity.getSoLuongTon() - soLuongMua;
          if (tongMoi < 0) tongMoi = 0;
          giayEntity.setSoLuongTon(tongMoi);
          giayRepository.save(giayEntity);
        }
      }
    }

    hoaDon.setUserEntity(user);
    hoaDonRepository.save(hoaDon);

    // Gửi mail đánh giá nếu có user
    if (user != null && user.getEmail() != null) {
      sendFormDanhGia(user, danhSachSanPham);
    }
  }

  public void sendFormDanhGia(UserEntity user, List<HoaDonChiTietEntity> danhSachSanPham) {
    StringBuilder productItems = new StringBuilder();

    for (HoaDonChiTietEntity hdct : danhSachSanPham) {
      UUID hoaDonChiTietId = hdct.getId();
      UUID userId = user.getId();

      productItems.append("<tr>");
      productItems.append("<td style=\"padding:15px;border-bottom:1px solid #dddddd;\">");
      productItems
          .append("<p style=\"margin:0;font-size:16px;\"><strong>")
          .append(hdct.getGiayChiTietEntity().getGiayEntity().getTen())
          .append("</strong></p>");
      productItems.append("</td>");
      productItems.append(
          "<td style=\"padding:15px;border-bottom:1px solid #dddddd;text-align:center;\">");
      productItems
          .append("<a href=\"http://localhost:3000/danh-gia?userId=")
          .append(userId)
          .append("&hoaDonChiTietId=")
          .append(hoaDonChiTietId)
          .append(
              "\" style=\"display:inline-block;padding:10px 20px;background-color:#1D70B8;color:#ffffff;text-decoration:none;border-radius:5px;font-weight:bold;\">")
          .append("Đánh giá ngay</a>");
      productItems.append("</td>");
      productItems.append("</tr>");
    }

    StringBuilder emailContent = new StringBuilder();
    emailContent.append("<!DOCTYPE html>");
    emailContent.append("<html lang=\"vi\">");
    emailContent.append("<head>");
    emailContent.append("<meta charset=\"UTF-8\">");
    emailContent.append("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">");
    emailContent.append("</head>");
    emailContent.append("<body>");
    emailContent.append(
        "<div style=\"font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#0b0c0c\">");
    emailContent.append(
        "<table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;min-width:100%;width:100%!important\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">");
    emailContent.append("<tr>");
    emailContent.append("<td bgcolor=\"#0b0c0c\" style=\"padding:20px;text-align:center;\">");
    emailContent.append(
        "<span style=\"font-size:28px;line-height:1.3;color:#ffffff;font-weight:bold;\">Đánh giá sản phẩm</span>");
    emailContent.append("</td>");
    emailContent.append("</tr>");
    emailContent.append("</table>");
    emailContent.append(
        "<table align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"max-width:580px;width:100%;margin:20px auto;\">");
    emailContent.append("<tr>");
    emailContent.append(
        "<td style=\"font-size:19px;line-height:1.6;color:#0b0c0c;padding:10px 20px;\">");
    emailContent.append("<p>Chào <strong>").append(user.getHoTen()).append("</strong>,</p>");
    emailContent.append(
        "<p>Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi. Vui lòng đánh giá sản phẩm bạn đã mua:</p>");
    emailContent.append("</td>");
    emailContent.append("</tr>");
    emailContent.append("</table>");
    emailContent.append(
        "<table align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"max-width:580px;width:100%;margin:0 auto 20px;border-collapse:collapse;\">");
    emailContent.append("<tr>");
    emailContent.append(
        "<th style=\"text-align:left;padding:15px;background-color:#f8f8f8;border-bottom:2px solid #1D70B8;\">Sản phẩm</th>");
    emailContent.append(
        "<th style=\"text-align:center;padding:15px;background-color:#f8f8f8;border-bottom:2px solid #1D70B8;\">Hành động</th>");
    emailContent.append("</tr>");
    emailContent.append(productItems.toString());
    emailContent.append("</table>");
    emailContent.append(
        "<table align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"max-width:580px;width:100%;margin:20px auto;\">");
    emailContent.append("<tr>");
    emailContent.append(
        "<td style=\"font-size:16px;line-height:1.6;color:#0b0c0c;padding:10px 20px;text-align:center;\">");
    emailContent.append("<p>Cảm ơn đánh giá của bạn!</p>");
    emailContent.append("<p>Trân trọng,<br>Đội ngũ cửa hàng</p>");
    emailContent.append("</td>");
    emailContent.append("</tr>");
    emailContent.append("</table>");
    emailContent.append("</div>");
    emailContent.append("</body>");
    emailContent.append("</html>");

    sendMailService.sendMail(
        user.getEmail(), "Đánh giá sản phẩm bạn đã mua", emailContent.toString());
  }

  @Override
  public HoaDonEntity createHoaDonBanHangTaiQuay() {

    if (hoaDonRepository.getListByTrangThai().size() > 5) {
      throw new IllegalStateException("Danh sách hóa đơn đã vượt quá giới hạn 5!");
    }

    HoaDonEntity hoaDonEntity =
        HoaDonEntity.builder()
            .ngayTao(new Date())
            .hinhThucMua(1)
            .hinhThucNhanHang(1)
            .trangThai(1)
            .build();

    return hoaDonRepository.save(hoaDonEntity);
  }

  @Override
  public HoaDonChiTietEntity themSanPhamVaoHoaDon(
      UUID idHoaDon, UUID idSanPham) {
    HoaDonEntity hoaDon =
        hoaDonRepository
            .findById(idHoaDon)
            .orElseThrow(() -> new IllegalArgumentException("Hóa đơn không tồn tại"));

    GiayChiTietEntity giayChiTiet =
        giayChiTietRepository
            .findById(idSanPham)
            .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại"));

    if (giayChiTiet.getSoLuongTon() <= 0) {
      throw new IllegalArgumentException("Sản phẩm đã hết hàng, không thể thêm vào hóa đơn");
    }

    HoaDonChiTietEntity hoaDonChiTiet =
        hoaDonChiTietRepository.findByHoaDonEntityAndGiayChiTietEntity(hoaDon, giayChiTiet);

    if (hoaDonChiTiet != null) {
      int newSoLuong = hoaDonChiTiet.getSoLuong() + 1;

      if (newSoLuong > giayChiTiet.getSoLuongTon()) {
        throw new IllegalArgumentException("Không đủ hàng để thêm vào hóa đơn");
      }

      hoaDonChiTiet.setSoLuong(newSoLuong);
      return hoaDonChiTietRepository.save(hoaDonChiTiet);
    }

    BigDecimal giaBanGoc = giayChiTiet.getGiaBan();
    BigDecimal giaSauGiam = giaBanGoc;

    List<GiamGiaChiTietSanPhamEntity> giamGiaOpt =
        giamGiaChiTietSanPhamRepository.findByGiayChiTiet(giayChiTiet.getId());

    if (giamGiaOpt != null && !giamGiaOpt.isEmpty()) {
      BigDecimal soTienDaGiam = giamGiaOpt.get(0).getSoTienDaGiam();
      giaSauGiam = giaBanGoc.subtract(soTienDaGiam);
    }

    HoaDonChiTietEntity hoaDonChiTietEntity =
        HoaDonChiTietEntity.builder()
            .soLuong(1)
            .giaBan(giayChiTiet.getGiaBan())
            .donGia(giaSauGiam)
            .trangThai(1)
            .hoaDonEntity(hoaDon)
            .giayChiTietEntity(giayChiTiet)
            .build();

    return hoaDonChiTietRepository.save(hoaDonChiTietEntity);
  }

  @Override
  public HoaDonChiTietEntity updateSoLuongGiay(UUID idHoaDonChiTiet, boolean isIncrease) {
    HoaDonChiTietEntity hoaDonChiTiet =
        hoaDonChiTietRepository
            .findById(idHoaDonChiTiet)
            .orElseThrow(() -> new IllegalArgumentException("Hóa đơn chi tiết không tồn tại"));

    int soLuongHienTai = hoaDonChiTiet.getSoLuong();
    int soLuongTon = hoaDonChiTiet.getGiayChiTietEntity().getSoLuongTon();

    if (isIncrease) {
      if (soLuongHienTai + 1 > soLuongTon) {
        throw new IllegalStateException("Số lượng không thể vượt quá số lượng tồn của sản phẩm");
      }
      hoaDonChiTiet.setSoLuong(soLuongHienTai + 1);
    } else {
      if (soLuongHienTai <= 1) {
        throw new IllegalStateException("Số lượng không thể nhỏ hơn 1");
      }
      hoaDonChiTiet.setSoLuong(soLuongHienTai - 1);
    }

    HoaDonChiTietEntity updated = hoaDonChiTietRepository.save(hoaDonChiTiet);
    if (updated == null) {
      throw new RuntimeException("❌ Lỗi khi cập nhật số lượng");
    }

    return updated;
  }

  @Override
  public List<HoaDonEntity> getListHoaDonCho() {
    return hoaDonRepository.getListByTrangThai();
  }

  @Override
  public List<HoaDonChiTietEntity> getSanPhamTrongHoaDon(UUID idHoaDon) {
    HoaDonEntity hoaDon =
        hoaDonRepository
            .findById(idHoaDon)
            .orElseThrow(() -> new IllegalArgumentException("Hóa đơn không tồn tại"));
    return hoaDonChiTietRepository.findByHoaDon(hoaDon);
  }

  @Override
  public void deleteHoaDonCho(UUID idHoaDon) {
    HoaDonEntity hoaDon =
        hoaDonRepository
            .findById(idHoaDon)
            .orElseThrow(() -> new IllegalArgumentException("Hóa đơn không tồn tại"));
    List<HoaDonChiTietEntity> hoaDonChiTietList = hoaDonChiTietRepository.findByHoaDon(hoaDon);

    //    hoaDonChiTietList.forEach(
    //        chiTiet -> {
    //          GiayChiTietEntity giayChiTiet = chiTiet.getGiayChiTietEntity();
    ////          giayChiTiet.setSoLuongTon(giayChiTiet.getSoLuongTon() + chiTiet.getSoLuong());
    ////          giayChiTietRepository.save(giayChiTiet);
    //        });

    hoaDonChiTietRepository.deleteAll(hoaDonChiTietList);

    hoaDonRepository.deleteById(idHoaDon);
  }

  @Override
  public void deleteAllHoaDonCho(List<UUID> idHoaDons) {
    List<HoaDonEntity> hoaDons = hoaDonRepository.findAllById(idHoaDons);
    if (hoaDons.isEmpty()) {
      throw new IllegalArgumentException("Không tìm thấy hóa đơn nào để xóa");
    }

    List<HoaDonChiTietEntity> hoaDonChiTietList =
        hoaDons.stream()
            .flatMap(hoaDon -> hoaDonChiTietRepository.findByHoaDon(hoaDon).stream())
            .collect(Collectors.toList());

    hoaDonChiTietList.forEach(
        chiTiet -> {
          GiayChiTietEntity giayChiTiet = chiTiet.getGiayChiTietEntity();
          giayChiTiet.setSoLuongTon(giayChiTiet.getSoLuongTon() + chiTiet.getSoLuong());
          giayChiTietRepository.save(giayChiTiet);
        });

    hoaDonChiTietRepository.deleteAll(hoaDonChiTietList);

    hoaDonRepository.deleteAllById(idHoaDons);
  }

  @Override
  public void deleteHoaDonChiTiet(UUID idHoaDonChiTiet) {
    HoaDonChiTietEntity hoaDonChiTiet =
        hoaDonChiTietRepository
            .findById(idHoaDonChiTiet)
            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hóa đơn chi tiết"));


    hoaDonChiTietRepository.delete(hoaDonChiTiet);
  }
}
