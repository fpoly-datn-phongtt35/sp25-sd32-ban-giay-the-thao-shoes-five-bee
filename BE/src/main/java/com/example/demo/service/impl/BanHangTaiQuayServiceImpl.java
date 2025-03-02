package com.example.demo.service.impl;

import com.example.demo.dto.request.HoaDonRequest;
import com.example.demo.entity.*;
import com.example.demo.repository.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.example.demo.service.BanHangTaiQuayService;
import com.example.demo.service.GiamGiaHoaDonChiTietService;
import lombok.RequiredArgsConstructor;
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

  @Override
  public void thanhToanTaiQuay(UUID idHoaDon, HoaDonRequest hoaDonRequest) {
    HoaDonEntity hoaDon =
        hoaDonRepository
            .findById(idHoaDon)
            .orElseThrow(() -> new IllegalArgumentException("Hóa đơn không tồn tại"));

    // Kiểm tra người dùng đã mua hàng chưa
    UserEntity user = userRepository.findBySoDienThoai(hoaDonRequest.getSdtNguoiNhan());

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
    BigDecimal tongTienSanPhamGoc =
        danhSachSanPham.stream()
            .map(
                hoaDonChiTiet ->
                    hoaDonChiTiet
                        .getGiaBan()
                        .multiply(BigDecimal.valueOf(hoaDonChiTiet.getSoLuong())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    // Tổng tiền saản phẩm có khuyễn mãi sản phẩm
    BigDecimal tongTienSanPhamKhiGiam =
        danhSachSanPham.stream()
            .map(
                hoaDonChiTiet ->
                    hoaDonChiTiet
                        .getDonGia()
                        .multiply(BigDecimal.valueOf(hoaDonChiTiet.getSoLuong())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    BigDecimal soTienGiamKhiApMa = BigDecimal.ZERO;
    if (hoaDonRequest.getMaGiamGia() != null && !hoaDonRequest.getMaGiamGia().isEmpty()) {
      GiamGiaHoaDonEntity giamGia = giamGiaHoaDonRepository.findByMa(hoaDonRequest.getMaGiamGia());

      // Nếu mã giảm giá tồn tại, kiểm tra điều kiện áp dụng
      if (giamGia != null
          && giamGia.getSoLuong() > 0
          && tongTienSanPhamGoc.compareTo(giamGia.getDieuKien()) >= 0) {
        soTienGiamKhiApMa =
            giamGiaHoaDonChiTietService.apDungPhieuGiamGia(
                idHoaDon, giamGia, tongTienSanPhamKhiGiam);
      }
    }

    BigDecimal soTienGiam = tongTienSanPhamGoc.subtract(tongTienSanPhamKhiGiam);
    BigDecimal phiShip = hoaDonRequest.getIsGiaoHang() ? BigDecimal.valueOf(30000) : BigDecimal.ZERO;

    hoaDon.setMa(hoaDonRequest.getMa());
    hoaDon.setNgayThanhToan(new Date());
    hoaDon.setMoTa(hoaDonRequest.getMoTa());
    hoaDon.setTenNguoiNhan(user != null ? hoaDonRequest.getTenNguoiNhan() : "Khách lẻ");
    hoaDon.setSdtNguoiNhan(hoaDonRequest.getSdtNguoiNhan());
    hoaDon.setXa(hoaDonRequest.getXa());
    hoaDon.setHuyen(hoaDonRequest.getHuyen());
    hoaDon.setTinh(hoaDonRequest.getTinh());
    hoaDon.setDiaChi(hoaDonRequest.getDiaChi());
    hoaDon.setTongTien(tongTienSanPhamKhiGiam.subtract(soTienGiamKhiApMa).add(phiShip));
    hoaDon.setHinhThucThanhToan(1);
    hoaDon.setSoTienGiam(soTienGiam.add(soTienGiamKhiApMa));
    hoaDon.setPhiShip(phiShip);
    hoaDon.setHinhThucNhanHang(hoaDonRequest.getIsGiaoHang() ? 1 : 2);
    hoaDon.setTrangThai(2);
    hoaDon.setUserEntity(user);

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
            .trangThai(1)
            .build();

    return hoaDonRepository.save(hoaDonEntity);
  }

  @Override
  public HoaDonChiTietEntity themSanPhamVaoHoaDon(UUID idHoaDon, UUID idSanPham) {
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
      giayChiTiet.setSoLuongTon(giayChiTiet.getSoLuongTon() - 1);

      giayChiTietRepository.save(giayChiTiet);
      return hoaDonChiTietRepository.save(hoaDonChiTiet);
    }

    BigDecimal giaBanGoc = giayChiTiet.getGiaBan();
    BigDecimal giaSauGiam = giaBanGoc;

    GiamGiaChiTietSanPhamEntity giamGiaOpt =
        giamGiaChiTietSanPhamRepository.findByGiayChiTiet(giayChiTiet.getId());

    if (giamGiaOpt != null) {
      BigDecimal soTienDaGiam = giamGiaOpt.getSoTienDaGiam();
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

    giayChiTiet.setSoLuongTon(giayChiTiet.getSoLuongTon() - 1);
    giayChiTietRepository.save(giayChiTiet);
    return hoaDonChiTietRepository.save(hoaDonChiTietEntity);
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

    // **Lưu lại vào database**
    giayChiTietRepository.save(giayChiTiet);
    return hoaDonChiTietRepository.save(hoaDonChiTiet);
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
