package com.example.demo.service.impl;

import com.example.demo.dto.request.HoaDonRequest;
import com.example.demo.entity.*;
import com.example.demo.repository.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import com.example.demo.service.BanHangTaiQuayService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BanHangTaiQuayServiceImpl implements BanHangTaiQuayService {

  private final HoaDonRepository hoaDonRepository;
  private final HoaDonChiTietRepository hoaDonChiTietRepository;
  private final GiayChiTietRepository giayChiTietRepository;
  private final GiamGiaChiTietSanPhamRepository giamGiaChiTietSanPhamRepository;
  private final GiayRepository giayRepository;

  @Override
  public void thanhToanTaiQuay(UUID idHoaDon, HoaDonRequest hoaDonRequest) {
    HoaDonEntity hoaDon =
        hoaDonRepository
            .findById(idHoaDon)
            .orElseThrow(() -> new IllegalArgumentException("Hóa đơn không tồn tại"));

    // Kiểm tra trạng thái hóa đơn
    if (hoaDon.getTrangThai() != 1) {
      throw new IllegalArgumentException("Hóa đơn đã được thanh toán hoặc không hợp lệ");
    }

    // Lấy danh sách sản phẩm trong hóa đơn
    List<HoaDonChiTietEntity> danhSachSanPham = hoaDonChiTietRepository.findByHoaDon(hoaDon);
    if (danhSachSanPham.isEmpty()) {
      throw new IllegalArgumentException("Không thể thanh toán hóa đơn trống");
    }

    BigDecimal tongTienSanPhamKhiGiam =
        danhSachSanPham.stream()
            .map(
                hoaDonChiTiet ->
                    hoaDonChiTiet
                        .getDonGia()
                        .multiply(BigDecimal.valueOf(hoaDonChiTiet.getSoLuong())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    BigDecimal tongTienSanPhamGoc =
        danhSachSanPham.stream()
            .map(
                hoaDonChiTiet ->
                    hoaDonChiTiet
                        .getGiaBan()
                        .multiply(BigDecimal.valueOf(hoaDonChiTiet.getSoLuong())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    BigDecimal soTienGiam = tongTienSanPhamGoc.subtract(tongTienSanPhamKhiGiam);

    hoaDon.setMa(hoaDonRequest.getMa());
    hoaDon.setNgayThanhToan(new Date());
    hoaDon.setMoTa(hoaDonRequest.getMoTa());
    hoaDon.setTenNguoiNhan(hoaDonRequest.getTenNguoiNhan());
    hoaDon.setSdtNguoiNhan(hoaDonRequest.getSdtNguoiNhan());
    hoaDon.setDiaChi(hoaDonRequest.getDiaChi());
    hoaDon.setTongTien(tongTienSanPhamKhiGiam);
    hoaDon.setHinhThucThanhToan(1);
    hoaDon.setSoTienGiam(soTienGiam);
    hoaDon.setTrangThai(2);

    hoaDonRepository.save(hoaDon);
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
            .phiShip(BigDecimal.valueOf(0.0))
            .trangThai(1)
            .build();

    return hoaDonRepository.save(hoaDonEntity);
  }

  @Override
  public HoaDonChiTietEntity themSanPhamVaoHoaDon(UUID idHoaDon, UUID idSanPham) {
    // 📌 Tìm hóa đơn (hoặc báo lỗi nếu không tồn tại)
    HoaDonEntity hoaDon = hoaDonRepository.findById(idHoaDon)
            .orElseThrow(() -> new IllegalArgumentException("Hóa đơn không tồn tại"));

    // 📌 Tìm sản phẩm chi tiết (GiayChiTietEntity) theo ID
    GiayChiTietEntity giayChiTiet = giayChiTietRepository.findById(idSanPham)
            .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại"));

    // 📌 Lấy `GiayEntity` từ `GiayChiTietEntity`
    GiayEntity giay = giayChiTiet.getGiayEntity();
    if (giay == null) {
      throw new IllegalArgumentException("Giày không hợp lệ!");
    }

    // 📌 Kiểm tra tồn kho trước khi thêm vào hóa đơn
    if (!kiemTraTonKho(giayChiTiet, 1)) {
      throw new IllegalArgumentException("Sản phẩm đã hết hàng, không thể thêm vào hóa đơn");
    }

    // 📌 Kiểm tra xem sản phẩm đã có trong hóa đơn chưa
    HoaDonChiTietEntity hoaDonChiTiet = hoaDonChiTietRepository
            .findByHoaDonEntityAndGiayChiTietEntity(hoaDon, giayChiTiet);

    // 📌 Tính toán giá bán & giá sau giảm giá
    BigDecimal giaBanGoc = giayChiTiet.getGiaBan();
    BigDecimal giaSauGiam = Optional.ofNullable(
                    giamGiaChiTietSanPhamRepository.findByGiay(giayChiTiet.getGiayEntity()))
            .map(GiamGiaChiTietSanPhamEntity::getSoTienDaGiam)
            .map(giaBanGoc::subtract)
            .orElse(giaBanGoc);

    if (hoaDonChiTiet != null) {
      // 📌 Nếu sản phẩm đã có, tăng số lượng
      int newSoLuong = hoaDonChiTiet.getSoLuong() + 1;
      if (!kiemTraTonKho(giayChiTiet, newSoLuong)) {
        throw new IllegalArgumentException("Không đủ hàng để thêm vào hóa đơn");
      }
      hoaDonChiTiet.setSoLuong(newSoLuong);
      hoaDonChiTiet.setDonGia(giaSauGiam); // Cập nhật giá sau giảm
    } else {
      // 📌 Nếu sản phẩm chưa có, thêm sản phẩm vào hóa đơn mới
      hoaDonChiTiet = HoaDonChiTietEntity.builder()
              .soLuong(1)
              .giaBan(giaBanGoc)
              .donGia(giaSauGiam)
              .trangThai(1)
              .hoaDonEntity(hoaDon)
              .giayChiTietEntity(giayChiTiet)
              .build();
    }

    // 📌 Cập nhật tồn kho của `GiayChiTietEntity`
    giayChiTiet.setSoLuongTon(giayChiTiet.getSoLuongTon() - 1);
    giayChiTietRepository.save(giayChiTiet);

    // 📌 Cập nhật lại tổng `soLuongTon` của `GiayEntity`
    capNhatSoLuongTongGiay(giay);

    // 📌 Lưu thông tin hóa đơn chi tiết
    hoaDonChiTietRepository.save(hoaDonChiTiet);

    return hoaDonChiTiet;
  }


  private void capNhatSoLuongTongGiay(GiayEntity giay) {
    int tongSoLuong = giayChiTietRepository.findByGiayEntity(giay)
            .stream().mapToInt(GiayChiTietEntity::getSoLuongTon).sum();

    giay.setSoLuongTon(tongSoLuong);
    giayRepository.save(giay);
  }

  private boolean kiemTraTonKho(GiayChiTietEntity giayChiTiet, int soLuongMuonThem) {
    return giayChiTiet.getSoLuongTon() >= soLuongMuonThem;
  }


  @Override
  public HoaDonChiTietEntity updateSoLuongGiay(UUID idHoaDonChiTiet, boolean isIncrease) {
    HoaDonChiTietEntity hoaDonChiTiet =
            hoaDonChiTietRepository
                    .findById(idHoaDonChiTiet)
                    .orElseThrow(() -> new IllegalArgumentException("Hóa đơn chi tiết không tồn tại"));

    GiayChiTietEntity giayChiTiet = hoaDonChiTiet.getGiayChiTietEntity();
    int soLuongHienTai = hoaDonChiTiet.getSoLuong();
    int soLuongTon = giayChiTiet.getSoLuongTon();

    if (isIncrease) {
      if (soLuongTon <= 0) {
        throw new IllegalStateException("Không đủ hàng để tăng số lượng");
      }
      hoaDonChiTiet.setSoLuong(soLuongHienTai + 1);
      giayChiTiet.setSoLuongTon(soLuongTon - 1);
    } else {
      if (soLuongHienTai <= 1) {
        throw new IllegalStateException("Số lượng không thể nhỏ hơn 1");
      }
      hoaDonChiTiet.setSoLuong(soLuongHienTai - 1);
      giayChiTiet.setSoLuongTon(soLuongTon + 1);
    }

    // **Cập nhật giá bán tổng (giá gốc * số lượng)**
    BigDecimal giaBanGoc = giayChiTiet.getGiaBan();
    hoaDonChiTiet.setGiaBan(giaBanGoc.multiply(BigDecimal.valueOf(hoaDonChiTiet.getSoLuong())));

    // **Tính toán lại giá sau giảm**
    BigDecimal giaSauGiam = giaBanGoc;
    GiamGiaChiTietSanPhamEntity giamGiaOpt =
            giamGiaChiTietSanPhamRepository.findByGiay(giayChiTiet.getGiayEntity());

    if (giamGiaOpt != null) {
      BigDecimal soTienDaGiam = giamGiaOpt.getSoTienDaGiam();
      giaSauGiam = giaBanGoc.subtract(soTienDaGiam);
    }

    // **Cập nhật đơn giá (giá sau giảm * số lượng)**
    hoaDonChiTiet.setDonGia(giaSauGiam.multiply(BigDecimal.valueOf(hoaDonChiTiet.getSoLuong())));

    // **Lưu lại vào database**
    giayChiTietRepository.save(giayChiTiet);
    return hoaDonChiTietRepository.save(hoaDonChiTiet);
  }







  @Override
  public List<HoaDonEntity> getListHoaDonCho() {
    return hoaDonRepository.getListByTrangThai();
  }

  @Override
  public void deleteHoaDonCho(UUID idHoaDon) {
    HoaDonEntity hoaDon =
        hoaDonRepository
            .findById(idHoaDon)
            .orElseThrow(() -> new IllegalArgumentException("Hóa đơn không tồn tại"));
    List<HoaDonChiTietEntity> hoaDonChiTietList = hoaDonChiTietRepository.findByHoaDon(hoaDon);

    hoaDonChiTietList.forEach(
        chiTiet -> {
          GiayChiTietEntity giayChiTiet = chiTiet.getGiayChiTietEntity();
          giayChiTiet.setSoLuongTon(giayChiTiet.getSoLuongTon() + chiTiet.getSoLuong());
          giayChiTietRepository.save(giayChiTiet);
        });

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

    GiayChiTietEntity giayChiTiet = hoaDonChiTiet.getGiayChiTietEntity();
    giayChiTiet.setSoLuongTon(giayChiTiet.getSoLuongTon() + hoaDonChiTiet.getSoLuong());

    giayChiTietRepository.save(giayChiTiet);

    hoaDonChiTietRepository.delete(hoaDonChiTiet);
  }

  //  public HoaDonChiTietEntity themSanPhamVaoHoaHoaBangMaVach(UUID idHoaDon, String maVach) {
  //    HoaDonEntity hoaDon = hoaDonRepository.findById(idHoaDon).orElse(null);
  //    GiayChiTietEntity giayChiTiet = giayChiTietRepository.findByMaVach(maVach);
  //
  //    HoaDonChiTietEntity hoaDonChiTiet =
  //        HoaDonChiTietEntity.builder()
  //            .soLuong(1)
  //            .giaBan(giayChiTiet.getGiaBan())
  //            .trangThai(1)
  //            .hoaDonEntity(hoaDon)
  //            .giayChiTietEntity(giayChiTiet)
  //            .build();
  //
  //    return hoaDonChiTietRepository.save(hoaDonChiTiet);
  //  }
  //
  //  private String scanBarcode(InputStream imageStream) {
  //    try {
  //      BufferedImage image = ImageIO.read(imageStream);
  //      if (image == null) {
  //        throw new IllegalStateException("Ảnh không hợp lệ");
  //      }
  //
  //      LuminanceSource source = new BufferedImageLuminanceSource(image);
  //      BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));
  //
  //      Result result = new MultiFormatReader().decode(bitmap);
  //      return result.getText(); // Trả về mã vạch đọc được
  //    } catch (NotFoundException e) {
  //      return "Không tìm thấy mã vạch";
  //    } catch (IOException e) {
  //      return "Lỗi đọc ảnh";
  //    }
  //  }
}
