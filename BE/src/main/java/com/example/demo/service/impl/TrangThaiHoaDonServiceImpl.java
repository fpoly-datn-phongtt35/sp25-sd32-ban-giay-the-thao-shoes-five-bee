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
        if (currentStatus == 7) {
            throw new RuntimeException("Hóa đơn đã bị hủy, không thể xác nhận tiếp.");
        }

        // Chuyển đổi trạng thái theo quy trình hợp lý
        switch (currentStatus) {
            case 3: // CHO_XAC_NHAN (Đặt ship)
                hoaDon.setTrangThai(4); // ĐÃ_XÁC_NHẬN
                break;
            case 4: // ĐÃ_XÁC_NHẬN
                if (kiemTraTonKho(hoaDon)) {
                    hoaDon.setTrangThai(6); // Còn hàng → ĐANG CHUẨN BỊ
                } else {
                    hoaDon.setTrangThai(5); // Hết hàng → CHỜ NHẬP HÀNG
                }
                break;
            case 5: // CHỜ NHẬP HÀNG
                if (kiemTraTonKho(hoaDon)) {
                    hoaDon.setTrangThai(6); // Khi có hàng → ĐANG CHUẨN BỊ
                } else {
                    throw new RuntimeException("Hàng chưa nhập đủ, không thể chuẩn bị đơn hàng.");
                }
                break;
            case 6: // ĐANG CHUẨN BỊ
                hoaDon.setTrangThai(8); // ĐANG GIAO HÀNG
                break;
            case 8: // ĐANG GIAO HÀNG
                hoaDon.setTrangThai(9); // GIAO THÀNH CÔNG
                break;
            case 9: // GIAO THÀNH CÔNG
                hoaDon.setTrangThai(2); // HOÀN THÀNH
                break;
//            case 10: // GIAO THẤT BẠI
//                if (kiemTraDaTraHang(hoaDon)) {
//                    hoaDon.setTrangThai(12); // ĐÃ TRẢ HÀNG
//                } else {
//                    hoaDon.setTrangThai(13); // MẤT HÀNG
//                }
//                break;
        }

        return hoaDonRepository.save(hoaDon);
    }
    private boolean kiemTraTonKho(HoaDonEntity hoaDon) {
        return hoaDon.getItems().stream().allMatch(sp -> sp.getSoLuong() > 0);
    }





    @Override
    public HoaDonEntity huyHoaDon(UUID id) {
        Optional<HoaDonEntity> hoaDonOpt = hoaDonRepository.findById(id);
        if (hoaDonOpt.isPresent()) {
            HoaDonEntity hoaDon = hoaDonOpt.get();

            // Chỉ có thể hủy nếu đơn chưa hoàn thành
            if (hoaDon.getTrangThai() == 2) {
                throw new RuntimeException("Hóa đơn đã hoàn thành, không thể hủy.");
            }

            hoaDon.setTrangThai(7); // ĐÃ HỦY
            return hoaDonRepository.save(hoaDon);
        } else {
            throw new RuntimeException("Không tìm thấy hóa đơn với ID: " + id);
        }
    }

    @Override
    public List<HoaDonEntity> getAllHoaDon() {
        return hoaDonRepository.findAll();
    }

}
