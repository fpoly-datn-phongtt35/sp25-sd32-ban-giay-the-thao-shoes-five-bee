package com.example.demo.service.impl;

import com.example.demo.dto.request.DanhGiaDto;
import com.example.demo.entity.DanhGiaEntity;
import com.example.demo.entity.HoaDonChiTietEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.repository.DanhGiaRepository;
import com.example.demo.repository.HoaDonChiTietRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.DanhGiaService;
import com.example.demo.service.SendMailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DanhGiaServiceImpl implements DanhGiaService {
    @Autowired
    private DanhGiaRepository danhGiaRepository;
    @Autowired
    private HoaDonChiTietRepository hoaDonChiTietRepository;
    @Autowired
    private UserRepository userRepository;


    @Override
    public void creteDanhGia(DanhGiaDto danhGiaDto) {
        HoaDonChiTietEntity hoaDonChiTietEntity = hoaDonChiTietRepository.findById(danhGiaDto.getHoaDonChiTietId())
                .orElseThrow(() -> new RuntimeException("không tìm thấy sản phẩm trong hóa đơn"));
        UserEntity userEntity = userRepository.findById(danhGiaDto.getUserId())
                .orElseThrow(() -> new RuntimeException("người dùng không tồn tại"));
        // hóa đơn ở trạng thái hoàn thành thì mới được đánh giá

        if (hoaDonChiTietEntity.getHoaDonEntity().getTrangThai() != 2){
            throw new RuntimeException("Chỉ có thể đánh giá khi đơn hàng đã hoàn thành");
        }

        // tạo đánh giá mới
        DanhGiaEntity danhGiaEntity = new DanhGiaEntity();
        danhGiaEntity.setHoaDonChiTietEntity(hoaDonChiTietEntity);
        danhGiaEntity.setUserEntity(userEntity);
        danhGiaEntity.setSaoDanhGia(danhGiaDto.getSaoDanhGia());
        danhGiaEntity.setNhanXet(danhGiaDto.getNhanXet());
        danhGiaEntity.setNgayNhanXet(danhGiaDto.getNgayNhanXet());// ngày hiện tại

        // lưu
        danhGiaRepository.save(danhGiaEntity);
    }

    @Override
    public List<DanhGiaDto> getDanhGiaByHoaDonChiTiet(UUID hoaDonChiTietId) {
        List<DanhGiaEntity> danhGiaEntities = danhGiaRepository.findByHoaDonChiTietEntityId(hoaDonChiTietId);
        return danhGiaEntities.stream().map(dg-> new DanhGiaDto(
                dg.getId(),
                dg.getHoaDonChiTietEntity().getId(),
                dg.getUserEntity().getId(),
                dg.getSaoDanhGia(),
                dg.getNhanXet(),
                dg.getNgayNhanXet()
        )).collect(Collectors.toList());
    }

    @Override
    public List<DanhGiaDto> getDanhGiaByProduct(UUID productId) {
        System.out.println("🔍 Đang tìm đánh giá cho sản phẩm ID: " + productId);

        List<DanhGiaEntity> danhGiaEntities = danhGiaRepository.findByGiayId(productId);

        System.out.println("📌 Số lượng đánh giá tìm thấy: " + danhGiaEntities.size());

        return danhGiaEntities.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private DanhGiaDto convertToDto(DanhGiaEntity danhGia) {
        return new DanhGiaDto(
                danhGia.getId(),
                danhGia.getHoaDonChiTietEntity().getId(),
                danhGia.getUserEntity().getId(),
                danhGia.getSaoDanhGia(),
                danhGia.getNhanXet(),
                danhGia.getNgayNhanXet()
        );
    }

}
