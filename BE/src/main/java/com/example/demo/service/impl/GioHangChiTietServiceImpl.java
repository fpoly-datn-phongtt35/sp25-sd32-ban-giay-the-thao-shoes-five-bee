package com.example.demo.service.impl;

import com.example.demo.dto.response.GioHangChiTietResponse;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.service.GioHangChiTietService;
import com.example.demo.service.GioHangService;
import com.example.demo.service.UsersService;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GioHangChiTietServiceImpl implements GioHangChiTietService {

  private final GioHangChiTietRepository gioHangChiTietRepository;
  private final GioHangRepository gioHangRepository;
  private final GioHangService gioHangService;
  private final UserRepository userRepository;
  private final UsersService usersService;
  private final GiayChiTietRepository giayChiTietRepository;
  private final GiamGiaChiTietSanPhamRepository giamGiaChiTietSanPhamRepository;
  private final GiayRepository giayRepository;


  @Override
  public List<GioHangChiTietResponse> getGioHangChiTietKhiCheckout(List<UUID> ids) {
    return gioHangChiTietRepository.findByIds(ids).stream()
        .map(
            gioHangChiTietEntity -> {
              GiayChiTietEntity giayChiTiet = gioHangChiTietEntity.getGiayChiTietEntity();
              GiayEntity giay = giayChiTiet.getGiayEntity();

              String anhGiayUrl =
                  Optional.ofNullable(giay.getAnhGiayEntities())
                      .filter(list -> !list.isEmpty())
                      .map(list -> list.get(0).getTenUrl())
                      .orElse(null); // URL mặc định nếu không có ảnh

              BigDecimal soTienDaGiam =
                  Optional.ofNullable(
                          giamGiaChiTietSanPhamRepository.findByGiayChiTiet(giayChiTiet.getId()))
                      .map(GiamGiaChiTietSanPhamEntity::getSoTienDaGiam)
                      .orElse(BigDecimal.ZERO);

              return GioHangChiTietResponse.builder()
                  .id(gioHangChiTietEntity.getId())
                  .giayChiTietId(giayChiTiet.getId())
                  .tenGiay(giay.getTen())
                  .anhGiayUrl(anhGiayUrl)
                  .mauSac(giayChiTiet.getMauSacEntity().getTen())
                  .kichCo(giayChiTiet.getKichCoEntity().getTen())
                  .giaBan(giayChiTiet.getGiaBan())
                  .donGiaKhiGiam(giayChiTiet.getGiaBan().subtract(soTienDaGiam))
                  .soLuong(gioHangChiTietEntity.getSoLuong())
                  .build();
            })
        .collect(Collectors.toList());
  }

  @Override
  public void addToCart(UUID idGiayChiTiet, Integer soLuong) {
    String email = usersService.getAuthenticatedUserEmail();

    Optional<UserEntity> user = userRepository.findByEmail(email);

    // Kiểm tra sản phẩm giày chi tiết có tồn tại không
    GiayChiTietEntity giayChiTiet =
        giayChiTietRepository
            .findById(idGiayChiTiet)
            .orElseThrow(() -> new RuntimeException("Giày chi tiết không tồn tại"));

    // Kiểm tra số lượng tồn kho
    if (giayChiTiet.getSoLuongTon() < soLuong) {
      throw new RuntimeException("Số lượng giày không đủ");
    }

    // Tìm giỏ hàng của user
    GioHangEntity gioHang =
        gioHangRepository
            .findByUserEntity(user.get())
            .orElseGet(
                () -> {
                  // Nếu user chưa có giỏ hàng, tạo mới
                  GioHangEntity newGioHang = new GioHangEntity();
                  newGioHang.setUserEntity(user.get());
                  newGioHang.setNgayTao(new Date(System.currentTimeMillis()));
                  newGioHang.setNgayCapNhat(new Date(System.currentTimeMillis()));
                  newGioHang.setTrangThai(1);
                  return gioHangRepository.save(newGioHang);
                });

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    Optional<GioHangChiTietEntity> existingItem =
        gioHangChiTietRepository.findByGioHangEntityAndGiayChiTietEntity(
            gioHang.getId(), giayChiTiet.getId());

    if (existingItem.isPresent()) {
      // Nếu sản phẩm đã có, cập nhật số lượng
      GioHangChiTietEntity gioHangChiTiet = existingItem.get();
      gioHangChiTiet.setSoLuong(gioHangChiTiet.getSoLuong() + soLuong);
      gioHangChiTietRepository.save(gioHangChiTiet);
    } else {
      // Nếu chưa có, thêm mới
      gioHangChiTietRepository.save(
          GioHangChiTietEntity.builder()
              .gioHangEntity(gioHang)
              .giayChiTietEntity(giayChiTiet)
              .soLuong(soLuong)
              .trangThai(1)
              .build());
    }
  }

  public GioHangChiTietEntity updateSoLuongGiay(UUID idGioHangChiTiet, boolean isIncrease) {
    GioHangChiTietEntity gioHangChiTietEntity =
        gioHangChiTietRepository
            .findById(idGioHangChiTiet)
            .orElseThrow(() -> new IllegalArgumentException("Giỏ hàng chi tiết không tồn tại"));

    if (isIncrease) {

      gioHangChiTietEntity.setSoLuong(gioHangChiTietEntity.getSoLuong() + 1);
    } else {
      if (gioHangChiTietEntity.getSoLuong() <= 1) {
        throw new IllegalStateException("Số lượng không thể nhỏ hơn 1");
      }
      gioHangChiTietEntity.setSoLuong(gioHangChiTietEntity.getSoLuong() - 1);
    }

    return gioHangChiTietRepository.save(gioHangChiTietEntity);
  }

  public void deleteSanPhamTrongGioHang(UUID idGioHangChiTiet) {
    gioHangChiTietRepository.deleteById(idGioHangChiTiet);
  }

  @Override
  public Integer getTotalProductsInCart(UUID idGioHang) {
    return gioHangChiTietRepository.countTotalProductsInCart(idGioHang);
  }
}
