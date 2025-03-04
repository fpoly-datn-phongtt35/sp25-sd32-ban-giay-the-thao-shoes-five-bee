package com.example.demo.service.impl;

import com.example.demo.entity.HoaDonEntity;
import com.example.demo.repository.HoaDonRepository;
import com.example.demo.service.TrangThaiHoaDonService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class TrangThaiHoaDonServiceImpl implements TrangThaiHoaDonService {
    @Autowired
    private HoaDonRepository hoaDonRepository;

    @Override
    public HoaDonEntity xacNhanHoaDon(UUID id) {
        Optional<HoaDonEntity> hoaDonOpt = hoaDonRepository.findById(id);

        if (hoaDonOpt.isEmpty()) {
            throw new RuntimeException("Không tìm thấy hóa đơn với ID: " + id);
        }

        HoaDonEntity hoaDon = hoaDonOpt.get();
        int currentStatus = hoaDon.getTrangThai();

        // Không thể cập nhật nếu hóa đơn đã hoàn thành hoặc bị hủy
        if (currentStatus == 2) {
            throw new RuntimeException("Hóa đơn đã hoàn thành, không thể xác nhận tiếp.");
        }
        if (currentStatus == 8) {
            throw new RuntimeException("Hóa đơn đã bị hủy, không thể xác nhận tiếp.");
        }

        // Chuyển đổi trạng thái theo luồng hợp lý
        switch (currentStatus) {
            case 0:
                hoaDon.setTrangThai(3); // Chờ xác nhận → Đã xác nhận
                break;
            case 3:
                hoaDon.setTrangThai(4); // Đã xác nhận → Chờ vận chuyển
                break;
            case 4:
                hoaDon.setTrangThai(5); // Chờ vận chuyển → Đang vận chuyển
                break;
            case 5:
                hoaDon.setTrangThai(6); // Đang vận chuyển → Đã giao hàng
                break;
            case 6:
                hoaDon.setTrangThai(2); // Đã giao hàng → Hoàn thành
                break;
            default:
                throw new RuntimeException("Trạng thái hiện tại không thể xác nhận tiếp.");
        }

        return hoaDonRepository.save(hoaDon);
    }



    @Override
    public HoaDonEntity huyHoaDon(UUID id) {
        Optional<HoaDonEntity> hoaDonOpt = hoaDonRepository.findById(id);
        if (hoaDonOpt.isPresent()) {
            HoaDonEntity hoaDon = hoaDonOpt.get();
            hoaDon.setTrangThai(8); // Đã hủy
            return hoaDonRepository.save(hoaDon);
        } else {
            throw new RuntimeException("Không tìm thấy hóa đơn với ID: " + id);
        }
    }

    @Override
    public List<HoaDonEntity> getAllHoaDon() {
        return hoaDonRepository.findAll();
    }

    @Override
    public Optional<HoaDonEntity> findById(UUID id) {
        return hoaDonRepository.findById(id);
    }

}
