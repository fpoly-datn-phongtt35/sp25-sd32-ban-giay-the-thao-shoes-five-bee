package com.example.demo.service.impl;

import com.example.demo.dto.request.BanHangOnlineRequest;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.service.BanHangService;
import com.example.demo.service.GiamGiaHoaDonChiTietService;
import com.example.demo.service.SendMailService;
import com.example.demo.service.UsersService;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BanHangOnlineServiceImpl implements BanHangService {

  private final GioHangChiTietRepository gioHangChiTietRepository;
  private final GiayChiTietRepository giayChiTietRepository;
  private final GiamGiaChiTietSanPhamRepository giamGiaChiTietSanPhamRepository;
  private final HoaDonChiTietRepository hoaDonChiTietRepository;
  private final HoaDonRepository hoaDonRepository;
  private final UsersService usersService;
  private final UserRepository userRepository;
  private final GiamGiaHoaDonRepository giamGiaHoaDonRepository;
  private final GiayRepository giayRepository;

  @Override
  @Transactional
  public HoaDonEntity banHangOnline(
      UUID idGiamGia, Integer hinhThucThanhToan, BanHangOnlineRequest banHangOnlineRequest) {

    GiamGiaHoaDonEntity giamGiaHoaDonEntity = new GiamGiaHoaDonEntity();

    if(idGiamGia != null){
       giamGiaHoaDonEntity =
              giamGiaHoaDonRepository.findById(idGiamGia).orElse(null);
    }else {
       giamGiaHoaDonEntity.setPhanTramGiam(0);
       giamGiaHoaDonEntity.setSoTienGiamMax(new BigDecimal(0));
    }

    HoaDonEntity hoaDonEntity = new HoaDonEntity();

    String email = usersService.getAuthenticatedUserEmail();


    List<GioHangChiTietEntity> gioHangChiTietEntities =
        gioHangChiTietRepository.findAllById(banHangOnlineRequest.getIdsGioHangChiTiet());

    List<HoaDonChiTietEntity> hoaDonChiTietEntities =
        gioHangChiTietEntities.stream()
            .map(
                gioHangChiTietEntity -> {
                    GiayChiTietEntity giayChiTiet =
                            giayChiTietRepository
                                    .findById(gioHangChiTietEntity.getGiayChiTietEntity().getId())
                                    .orElseThrow(() -> new RuntimeException());
                    // kiểm tra số lượng tồn trước
                  if (gioHangChiTietEntity.getSoLuong() > giayChiTiet.getSoLuongTon()){
                      throw new RuntimeException("Sản phẩm"
                      + giayChiTiet.getGiayEntity().getTen()
                              + " không đủ số lượng tồn (còn "
                              + giayChiTiet.getSoLuongTon() + ")");
                  }

                  List<GiamGiaChiTietSanPhamEntity> giamGiaOpt =
                      giamGiaChiTietSanPhamRepository.findByGiayChiTiet(giayChiTiet.getId());
                  BigDecimal soTienDaGiam =
                      giamGiaOpt != null &&  !giamGiaOpt.isEmpty() ? giamGiaOpt.get(0).getSoTienDaGiam() : BigDecimal.ZERO;
                  BigDecimal donGia = giayChiTiet.getGiaBan().subtract(soTienDaGiam);

                      giayChiTietRepository.save(giayChiTiet);


                  return HoaDonChiTietEntity.builder()
                          .soLuong(gioHangChiTietEntity.getSoLuong())
                          .giaBan(giayChiTiet.getGiaBan())
                          .donGia(donGia)
                          .trangThai(1)
                          .giayChiTietEntity(giayChiTiet)
                          .hoaDonEntity(hoaDonEntity)
                          .build();
                })
            .collect(Collectors.toList());

    BigDecimal donGiaGiam =
        hoaDonChiTietEntities.stream()
            .map(
                hoaDonChiTietEntity ->
                    hoaDonChiTietEntity
                        .getDonGia()
                        .multiply(BigDecimal.valueOf(hoaDonChiTietEntity.getSoLuong())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    BigDecimal tienGoc =
        hoaDonChiTietEntities.stream()
            .map(
                hoaDonChiTietEntity ->
                    hoaDonChiTietEntity
                        .getGiaBan()
                        .multiply(BigDecimal.valueOf(hoaDonChiTietEntity.getSoLuong())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    BigDecimal soTienGiamKhiApMa = BigDecimal.ZERO;
    if (idGiamGia != null) {
      GiamGiaHoaDonEntity giamGia = giamGiaHoaDonRepository.findById(idGiamGia).orElse(null);

      // Nếu mã giảm giá tồn tại, kiểm tra điều kiện áp dụng
      if (giamGia != null
          && giamGia.getSoLuong() > 0
          && donGiaGiam.compareTo(giamGia.getDieuKien()) >= 0 && giamGia.getTrangThai() == 0) {
        soTienGiamKhiApMa =
            donGiaGiam
                .multiply(BigDecimal.valueOf(giamGiaHoaDonEntity.getPhanTramGiam()))
                .divide(BigDecimal.valueOf(100));

        if (soTienGiamKhiApMa.compareTo(giamGiaHoaDonEntity.getSoTienGiamMax()) > 0) {
          soTienGiamKhiApMa = giamGiaHoaDonEntity.getSoTienGiamMax();
        }
      }
    }

    BigDecimal tongTienThanhToan =
        donGiaGiam.subtract(soTienGiamKhiApMa);
    BigDecimal soTienGiam = tienGoc.subtract(donGiaGiam).add(soTienGiamKhiApMa);

    hoaDonEntity.setMa(generateUniqueCode());
    hoaDonEntity.setNgayTao(new Date());
    hoaDonEntity.setNgayThanhToan(hinhThucThanhToan == 2 ? new Date() : null);
    hoaDonEntity.setMoTa(banHangOnlineRequest.getMoTa());
    hoaDonEntity.setTenNguoiNhan(banHangOnlineRequest.getTenNguoiNhan());
    hoaDonEntity.setSdtNguoiNhan(banHangOnlineRequest.getSdtNguoiNhan());
    hoaDonEntity.setXa(banHangOnlineRequest.getXa());
    hoaDonEntity.setHuyen(banHangOnlineRequest.getHuyen());
    hoaDonEntity.setTinh(banHangOnlineRequest.getTinh());
    hoaDonEntity.setUserEntity(userRepository.findByEmail(email).get());
    hoaDonEntity.setDiaChi(banHangOnlineRequest.getDiaChi());
    hoaDonEntity.setTongTien(tongTienThanhToan);
    hoaDonEntity.setHinhThucMua(2);
    hoaDonEntity.setHinhThucThanhToan(hinhThucThanhToan);
    hoaDonEntity.setHinhThucNhanHang(1);
    hoaDonEntity.setSoTienGiam(soTienGiam);
    hoaDonEntity.setPhiShip(BigDecimal.valueOf(0));
    if (banHangOnlineRequest.getHinhThucThanhToan() ==1 ){
              gioHangChiTietEntities.stream()
                      .forEach(
                              gioHangChiTietEntity -> {
                                GiayChiTietEntity giayChiTiet =
                                        giayChiTietRepository
                                                .findById(gioHangChiTietEntity.getGiayChiTietEntity().getId())
                                                .orElse(null);

                                if(giayChiTiet != null){
                                giayChiTiet.setSoLuongTon(
                                        giayChiTiet.getSoLuongTon() - gioHangChiTietEntity.getSoLuong());
                                giayChiTietRepository.save(giayChiTiet);
                                // lấy sản phẩm tổng (giày entity)
                                    GiayEntity giayEntity = giayChiTiet.getGiayEntity();
                                    if (giayEntity != null){
                                        // tính tổng lại số lượng từ tất cả biến thể của sản phẩm
                                        int tongSoLuong = giayChiTietRepository.sumSoLuongTonByGiay(giayEntity.getId());
                                        giayEntity.setSoLuongTon(tongSoLuong);
                                        giayRepository.save(giayEntity);
                                    }
                                }
                                });
      hoaDonEntity.setTrangThai(3);
    }else {
      hoaDonEntity.setTrangThai(0);
    }
    hoaDonEntity.setUserEntity(userRepository.findByEmail(email).get());

    hoaDonChiTietRepository.saveAll(hoaDonChiTietEntities);
//    giayChiTietRepository.save(giay)

    gioHangChiTietRepository.deleteAllById(banHangOnlineRequest.getIdsGioHangChiTiet());

    return hoaDonRepository.save(hoaDonEntity);
  }



    private String generateUniqueCode() {
        return "HD" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}
