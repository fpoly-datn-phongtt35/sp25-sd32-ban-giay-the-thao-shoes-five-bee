package com.example.demo.service.impl;

import com.example.demo.dto.response.GioHangChiTietResponse;
import com.example.demo.entity.GioHangChiTietEntity;
import com.example.demo.entity.GioHangEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.repository.GioHangChiTietRepository;
import com.example.demo.repository.GioHangRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.GioHangService;
import com.example.demo.service.UsersService;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GioHangServiceImpl implements GioHangService {

  private final GioHangRepository gioHangRepository;
  private final UserRepository userRepository;
  private final UsersService usersService;
  private final GioHangChiTietRepository gioHangChiTietRepository;

  @Override
  public List<GioHangChiTietResponse> getCartItems() {
    String email = usersService.getAuthenticatedUserEmail();

    Optional<UserEntity> userEntityOptional = userRepository.findByEmail(email);
    if(userEntityOptional.isEmpty()){
      throw new RuntimeException("Không tìm thấy user với email :" +email);
    }

    UserEntity userEntity = userEntityOptional.get();
    // Tìm giỏ hàng của user nếu chưa có thì tạo mới
    GioHangEntity gioHang = gioHangRepository.findByUserEntity(userEntity)
            .orElseGet(()->{
              GioHangEntity newGioHang = new GioHangEntity();
              newGioHang.setUserEntity(userEntity);
              return gioHangRepository.save(newGioHang);
            });

    // Lấy danh sách sản phẩm trong giỏ hàng
    List<GioHangChiTietEntity> chiTietList =
        gioHangChiTietRepository.findByGioHangEntity(gioHang.getId());

    // Chuyển đổi sang DTO để trả về frontend
    return chiTietList.stream()
        .map(
            item ->
                new GioHangChiTietResponse(
                    item.getId(),
                    item.getGiayChiTietEntity().getId(),
                    item.getGiayChiTietEntity().getGiayEntity().getTen(),
                    item.getGiayChiTietEntity().getMauSacEntity().getTen(),
                    item.getGiayChiTietEntity().getKichCoEntity().getTen(),
                    item.getGiayChiTietEntity().getGiaBan(),
                    item.getSoLuong()))
        .collect(Collectors.toList());
  }
}
