package com.example.demo.service.impl;

import com.example.demo.dto.request.TraHangChiTietResDto;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.service.TraHangService;
import com.example.demo.service.UsersService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TraHangServiceImpl implements TraHangService {
    @Autowired
    private TraHangEntityRepository traHangEntityRepository;
    @Autowired
    private TraHangChiTietEntityRepository traHangChiTietEntityRepository;
    @Autowired
    private HoaDonRepository hoaDonRepository;
    @Autowired
    private GiayChiTietRepository giayChiTietRepository;
    @Autowired
    private UsersService usersService;
    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public TraHangEntity traHang(UUID hoaDonId, List<TraHangChiTietResDto> traHangChiTietResDtos) {
        String email = usersService.getAuthenticatedUserEmail();
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("khong tim thay user voi email : "+email));

        HoaDonEntity hoaDonEntity = hoaDonRepository.findById(hoaDonId)
                .orElseThrow(() -> new RuntimeException("hoa don khong ton tai"));
        // tao tra hang
        TraHangEntity traHangEntity = TraHangEntity.builder()
                .hoaDonEntity(hoaDonEntity)
                .userEntity(userEntity)
                .ngayTraHang(new Date(System.currentTimeMillis()))
                .tongTienHoanTra(BigDecimal.ZERO)
                .trangThai(1) // 1 dang xu ly , 2 hoan thanh
                .build();
        traHangEntity = traHangEntityRepository.save(traHangEntity);

        BigDecimal tongTienHoanTra = BigDecimal.ZERO;
        for (TraHangChiTietResDto chiTietResDto : traHangChiTietResDtos){
            HoaDonChiTietEntity hoaDonChiTietEntity = hoaDonEntity.getItems().stream()
                    .filter(item -> item.getId().equals(chiTietResDto.getHoaDonChiTietId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("San pham khong co trong hoa don"));
            // kiem tra so luong hop le
            if (chiTietResDto.getSoLuongTra() > hoaDonChiTietEntity.getSoLuong()){
                throw new RuntimeException("Số lượng trả vượt quá số lượng đã mua");
            }
            // tao tra hang chi tiet
            TraHangChiTietEntity traHangChiTietEntity  = TraHangChiTietEntity.builder()
                    .traHangEntity(traHangEntity)
                    .hoaDonChiTietEntity(hoaDonChiTietEntity)
                    .soLuongTra(chiTietResDto.getSoLuongTra())
                    .giaHoanTra(hoaDonChiTietEntity.getDonGia().multiply(new BigDecimal(chiTietResDto.getSoLuongTra())))
                    .build();
            traHangChiTietEntityRepository.save(traHangChiTietEntity);

            tongTienHoanTra = tongTienHoanTra.add(traHangChiTietEntity.getGiaHoanTra());
            // cap nhat lai so luong san pham con lai trong hoa don
            hoaDonChiTietEntity.setSoLuong(hoaDonChiTietEntity.getSoLuong() - chiTietResDto.getSoLuongTra());
            // cap nhat so luong ton kho neu hang duoc nhap lai kho
            GiayChiTietEntity giayChiTietEntity = hoaDonChiTietEntity.getGiayChiTietEntity();
            giayChiTietEntity.setSoLuongTon(giayChiTietEntity.getSoLuongTon() + chiTietResDto.getSoLuongTra());
            giayChiTietRepository.save(giayChiTietEntity);
        }
        // cap nhat tong tien hoan tra
        traHangEntity.setTongTienHoanTra(tongTienHoanTra);
        traHangEntityRepository.save(traHangEntity);
        // cap nhat tong tien cua hoa don sau khi tru so tien hoan tra
        hoaDonEntity.setTongTien(hoaDonEntity.getTongTien().subtract(tongTienHoanTra));

        boolean tatCaSanPhamDaTra = hoaDonEntity.getItems().stream()
                .allMatch(item -> item.getSoLuong() == 0);
        if (tatCaSanPhamDaTra) {
            hoaDonEntity.setTrangThai(9); // 7: hoan tra toan bo
        } else {
            hoaDonEntity.setTrangThai(10); // 9: hoan tra mot phan
        }
        hoaDonRepository.save(hoaDonEntity);

        return traHangEntity;
    }
}
