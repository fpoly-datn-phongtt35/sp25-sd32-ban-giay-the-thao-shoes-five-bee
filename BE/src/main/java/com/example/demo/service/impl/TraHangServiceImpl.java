package com.example.demo.service.impl;

import com.example.demo.dto.request.TraHangChiTietResDto;
import com.example.demo.dto.request.XemTraHangDto;
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
import java.util.stream.Collectors;

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
    @Autowired
    private HoaDonChiTietRepository hoaDonChiTietRepository;
    @Autowired
    private TraHangRepository traHangRepository;


    // Tạo TraHangEntity (Bước đầu tạo trả hàng, chỉ tạo entity mà chưa tính toán gì)
    @Override
    @Transactional
    public TraHangEntity createTraHang(UUID hoaDonId, List<TraHangChiTietResDto> traHangChiTietResDtos) {
        // Lấy thông tin người dùng
        String email = usersService.getAuthenticatedUserEmail();
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với email: " + email));

        // Lấy thông tin hóa đơn
        HoaDonEntity hoaDonEntity = hoaDonRepository.findById(hoaDonId)
                .orElseThrow(() -> new RuntimeException("Hóa đơn không tồn tại"));

        // Tạo TraHangEntity với trạng thái "Đang xử lý"
        TraHangEntity traHangEntity = TraHangEntity.builder()
                .hoaDonEntity(hoaDonEntity)
                .userEntity(userEntity)
                .ngayTraHang(new java.sql.Date(System.currentTimeMillis()))
                .tongTienHoanTra(BigDecimal.ZERO)
                .trangThai(1) // Trạng thái 1: Đang xử lý
                .build();
        traHangEntity = traHangEntityRepository.save(traHangEntity);  // Chỉ tạo và lưu đối tượng trả hàng

        // Tạo các TraHangChiTietEntity cho mỗi sản phẩm trong danh sách trả hàng
        for (TraHangChiTietResDto chiTietResDto : traHangChiTietResDtos) {
            HoaDonChiTietEntity hoaDonChiTietEntity = hoaDonEntity.getItems().stream()
                    .filter(item -> item.getId().equals(chiTietResDto.getHoaDonChiTietId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không có trong hóa đơn"));

            // Tạo chi tiết trả hàng (TraHangChiTietEntity)
            TraHangChiTietEntity traHangChiTietEntity = TraHangChiTietEntity.builder()
                    .hoaDonEntity(hoaDonEntity)
                    .traHangEntity(traHangEntity)
                    .hoaDonChiTietEntity(hoaDonChiTietEntity)
                    .soLuongTra(chiTietResDto.getSoLuongTra())
                    .giaHoanTra(hoaDonChiTietEntity.getDonGia().multiply(new BigDecimal(chiTietResDto.getSoLuongTra())))
                    .build();
            traHangChiTietEntityRepository.save(traHangChiTietEntity);

            // Cập nhật lại tổng tiền hoàn trả
            traHangEntity.setTongTienHoanTra(traHangEntity.getTongTienHoanTra().add(traHangChiTietEntity.getGiaHoanTra()));
        }

        return traHangEntity;
    }


    // Hủy trả hàng (Không tính toán gì, chỉ thay đổi trạng thái của trả hàng)
    @Override
    @Transactional
    public void cancelTraHang(UUID traHangId) {
        TraHangEntity traHangEntity = traHangEntityRepository.findById(traHangId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy trả hàng với ID: " + traHangId));

        // Kiểm tra trạng thái trả hàng và cập nhật thành đã hủy
        if (traHangEntity.getTrangThai() == 1) {
            traHangEntity.setTrangThai(0); // Trạng thái 0: Đã hủy
            traHangEntityRepository.save(traHangEntity);
        } else {
            throw new RuntimeException("Không thể hủy trả hàng trong trạng thái này.");
        }
    }

    // Xác nhận trả hàng (Thực hiện các thay đổi như số lượng, tồn kho, tổng tiền hoàn trả)
    @Override
    @Transactional
    public void confirmTraHang(UUID traHangId) {
        TraHangEntity traHangEntity = traHangEntityRepository.findById(traHangId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy trả hàng với ID: " + traHangId));

        // Kiểm tra trạng thái, chỉ xác nhận trả hàng nếu trạng thái là "Đang xử lý"
        if (traHangEntity.getTrangThai() == 1) {
            BigDecimal tongTienHoanTra = BigDecimal.ZERO;  // Đảm bảo khởi tạo lại tổng tiền hoàn trả

            // Xử lý các chi tiết trả hàng
            for (TraHangChiTietEntity traHangChiTietEntity : traHangEntity.getTraHangChiTietEntities()) {
                HoaDonChiTietEntity hoaDonChiTietEntity = traHangChiTietEntity.getHoaDonChiTietEntity();

                // Cập nhật số lượng trong hóa đơn
                hoaDonChiTietEntity.setSoLuong(hoaDonChiTietEntity.getSoLuong() - traHangChiTietEntity.getSoLuongTra());
                hoaDonChiTietEntity.setTrangThai(3);  // Trạng thái 3 là "Hoàn trả"
                hoaDonChiTietRepository.save(hoaDonChiTietEntity);

                // Cập nhật tồn kho
                GiayChiTietEntity giayChiTietEntity = hoaDonChiTietEntity.getGiayChiTietEntity();
                giayChiTietEntity.setSoLuongTon(giayChiTietEntity.getSoLuongTon() + traHangChiTietEntity.getSoLuongTra());
                giayChiTietRepository.save(giayChiTietEntity);

                // Tính tổng tiền hoàn trả
                BigDecimal giaHoanTra = hoaDonChiTietEntity.getDonGia().multiply(new BigDecimal(traHangChiTietEntity.getSoLuongTra()));
                tongTienHoanTra = tongTienHoanTra.add(giaHoanTra);
            }

            // Cập nhật tổng tiền hoàn trả cho đối tượng TraHangEntity
            traHangEntity.setTongTienHoanTra(tongTienHoanTra);
            traHangEntity.setTrangThai(2);  // Trạng thái 2: Hoàn thành
            traHangEntityRepository.save(traHangEntity);

            // Cập nhật tổng tiền của hóa đơn sau khi trừ tiền hoàn trả
            HoaDonEntity hoaDonEntity = traHangEntity.getHoaDonEntity();
            hoaDonEntity.setTongTien(hoaDonEntity.getTongTien().subtract(tongTienHoanTra));
            hoaDonRepository.save(hoaDonEntity);

            // Cập nhật trạng thái của hóa đơn: Hoàn trả một phần hoặc toàn bộ
            boolean tatCaSanPhamDaTra = hoaDonEntity.getItems().stream()
                    .allMatch(item -> item.getSoLuong() == 0); // Kiểm tra xem tất cả sản phẩm đã được trả chưa

            if (tatCaSanPhamDaTra) {
                hoaDonEntity.setTrangThai(7); // Trạng thái 7: Hoàn trả toàn bộ
            } else {
                hoaDonEntity.setTrangThai(9); // Trạng thái 9: Hoàn trả một phần
            }

            hoaDonRepository.save(hoaDonEntity);  // Lưu lại trạng thái mới của hóa đơn
        } else {
            throw new RuntimeException("Trả hàng không thể xác nhận trong trạng thái này.");
        }
    }




    @Override
    public List<XemTraHangDto> getProductsReturned(UUID hoaDonId) {
        // Lấy hóa đơn từ ID
        HoaDonEntity hoaDonEntity = hoaDonRepository.findById(hoaDonId)
                .orElseThrow(() -> new RuntimeException("Hoa don khong ton tai"));

        // Lấy các sản phẩm đã được hoàn trả từ hóa đơn
        List<TraHangChiTietEntity> traHangChiTietEntities = traHangChiTietEntityRepository.findByHoaDonEntity(hoaDonEntity);

        // Lọc các sản phẩm có trạng thái đã hoàn trả và tính số lượng trả lại
        List<XemTraHangDto> returnedProducts = traHangChiTietEntities.stream()
                .filter(traHang -> traHang.getHoaDonChiTietEntity().getTrangThai() == 3)  // Trạng thái 3: "Hoàn trả"
                .map(traHang -> {
                    // Tạo DTO để trả về
                    XemTraHangDto dto = new XemTraHangDto();
                    dto.setHoaDonChiTietId(traHang.getHoaDonChiTietEntity().getId());

                    // Lấy tên giày từ GiayEntity
                    String tenGiay = traHang.getHoaDonChiTietEntity().getGiayChiTietEntity().getGiayEntity().getTen();
                    dto.setTenSanPham(tenGiay);  // Gán tên giày vào DTO

                    dto.setSoLuongTra(traHang.getSoLuongTra());
                    dto.setGiaHoanTra(traHang.getGiaHoanTra());
                    return dto;
                })
                .collect(Collectors.toList());

        return returnedProducts;
    }

    @Override
    public Optional<TraHangEntity> findById(UUID traHangId) {
        // Tìm TraHangEntity theo ID và trả về Optional
        return traHangEntityRepository.findById(traHangId);
    }
}
