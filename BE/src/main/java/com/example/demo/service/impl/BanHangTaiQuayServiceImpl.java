package com.example.demo.service.impl;

import com.example.demo.dto.request.HoaDonRequest;
import com.example.demo.entity.GiamGiaChiTietSanPhamEntity;
import com.example.demo.entity.GiayChiTietEntity;
import com.example.demo.entity.HoaDonChiTietEntity;
import com.example.demo.entity.HoaDonEntity;
import com.example.demo.repository.GiamGiaChiTietSanPhamRepository;
import com.example.demo.repository.GiayChiTietRepository;
import com.example.demo.repository.HoaDonChiTietRepository;
import com.example.demo.repository.HoaDonRepository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
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

  @Override
  public void thanhToanTaiQuay(UUID idHoaDon, HoaDonRequest hoaDonRequest) {
    HoaDonEntity hoaDon = hoaDonRepository.findById(idHoaDon)
            .orElseThrow(() -> new IllegalArgumentException("Hóa đơn không tồn tại"));

    if (hoaDon.getTrangThai() != 1) {
      throw new IllegalArgumentException("Hóa đơn đã được thanh toán hoặc không hợp lệ");
    }

    List<HoaDonChiTietEntity> danhSachSanPham = hoaDonChiTietRepository.findByHoaDon(hoaDon);
    if (danhSachSanPham.isEmpty()) {
      throw new IllegalArgumentException("Không thể thanh toán hóa đơn trống");
    }

    // Tính tổng tiền
    BigDecimal tongTienSanPhamKhiGiam = danhSachSanPham.stream()
            .map(hdct -> hdct.getDonGia().multiply(BigDecimal.valueOf(hdct.getSoLuong())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    BigDecimal tongTienSanPhamGoc = danhSachSanPham.stream()
            .map(hdct -> hdct.getGiaBan().multiply(BigDecimal.valueOf(hdct.getSoLuong())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    BigDecimal soTienGiam = tongTienSanPhamGoc.subtract(tongTienSanPhamKhiGiam);

    // Nhận số tiền khách đưa
    BigDecimal soTienKhachDua = hoaDonRequest.getSoTienKhachDua();
    if (soTienKhachDua == null || soTienKhachDua.compareTo(tongTienSanPhamKhiGiam) < 0) {
      throw new IllegalArgumentException("Số tiền khách đưa không đủ để thanh toán");
    }

    // Tính tiền thừa
    BigDecimal tienThua = soTienKhachDua.subtract(tongTienSanPhamKhiGiam);

    // Cập nhật thông tin hóa đơn
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

    // In tiền thừa ra log hoặc console (hoặc xử lý trả về qua controller)
    System.out.println("Tiền thừa: " + tienThua + " VND");
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
        giamGiaChiTietSanPhamRepository.findByGiay(giayChiTiet.getGiayEntity());

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
