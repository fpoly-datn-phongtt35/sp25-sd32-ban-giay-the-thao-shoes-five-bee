package com.example.demo.service.impl;

import com.example.demo.dto.request.HoaDonDto;
import com.example.demo.dto.request.UserDto;
import com.example.demo.entity.GiayChiTietEntity;
import com.example.demo.entity.GioHangChiTietEntity;
import com.example.demo.entity.HoaDonChiTietEntity;
import com.example.demo.entity.HoaDonEntity;
import com.example.demo.repository.GiayChiTietRepository;
import com.example.demo.repository.GioHangChiTietRepository;
import com.example.demo.repository.HoaDonRepository;
import com.example.demo.service.GioHangChiTietService;
import com.example.demo.service.TrangThaiHoaDonService;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TrangThaiHoaDonServiceImpl implements TrangThaiHoaDonService {
    @Autowired
    private HoaDonRepository hoaDonRepository;
    @Autowired
    private GioHangChiTietRepository gioHangChiTietRepository;
    @Autowired
    private GiayChiTietRepository giayChiTietRepository;

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
                // Trừ số lượng tồn kho khi chuyển từ "Chờ xác nhận" sang "Đã xác nhận"
                updateStockAfterOrderConfirmed(hoaDon);
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

    // Giảm số lượng tồn kho khi trạng thái hóa đơn được xác nhận
    private void updateStockAfterOrderConfirmed(HoaDonEntity hoaDon) {
        for (HoaDonChiTietEntity item : hoaDon.getItems()) {
            GiayChiTietEntity giayChiTiet = item.getGiayChiTietEntity();
            int remainingStock = giayChiTiet.getSoLuongTon() - item.getSoLuong();

            if (remainingStock < 0) {
                throw new RuntimeException("Sản phẩm " + giayChiTiet.getMaVach() + " không đủ số lượng trong kho.");
            }

            giayChiTiet.setSoLuongTon(remainingStock);
            giayChiTietRepository.save(giayChiTiet);
        }
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
    public List<HoaDonDto> getAllHoaDon() {
        List<HoaDonEntity> hoaDons = hoaDonRepository.findAll();
        return hoaDons.stream().map(hd -> {
            UserDto userDto = null;
            if (hd.getUserEntity() != null) {
                try {
                    userDto = new UserDto(
                        hd.getUserEntity().getId(),
                        null, // Không cần ảnh
                        hd.getUserEntity().getHoTen(),
                        null, // Không cần ngày sinh
                        hd.getUserEntity().getSoDienThoai(),
                        hd.getUserEntity().getEmail(),
                        null, // Không cần mật khẩu
                        null, // Không cần isEnabled
                        null, // Không cần roleNames
                        null  // Không cần địa chỉ
                    );
                } catch (Exception e) {
                    // Xử lý trường hợp không thể truy cập thông tin người dùng
                    userDto = new UserDto(
                        UUID.fromString("00000000-0000-0000-0000-000000000000"),
                        null,
                        "Người dùng không tồn tại",
                        null,
                        "N/A",
                        "N/A",
                        null,
                        null,
                        null,
                        null
                    );
                }
            }
            
            return new HoaDonDto(
                hd.getId(),
                hd.getMa(),
                hd.getNgayTao(),
                hd.getNgayThanhToan(),
                hd.getMoTa(),
                hd.getTenNguoiNhan(),
                hd.getSdtNguoiNhan(),
                hd.getXa(),
                hd.getHuyen(),
                hd.getTinh(),
                hd.getDiaChi(),
                hd.getTongTien(),
                hd.getHinhThucMua(),
                hd.getHinhThucThanhToan(),
                hd.getHinhThucNhanHang(),
                hd.getSoTienGiam(),
                hd.getPhiShip(),
                hd.getTrangThai(),
                userDto
            );
        }).collect(Collectors.toList());
    }

    @Override
    public Optional<HoaDonEntity> findById(UUID id) {
        return hoaDonRepository.findById(id);
    }

    @Override
    public byte[] printHoaDon(UUID id) {
        Optional<HoaDonEntity> optional = hoaDonRepository.findById(id);
        if (optional.isPresent()){
            HoaDonEntity hoaDonEntity = optional.get();
            ByteArrayOutputStream hoaDon1 = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(hoaDon1);
            PdfDocument pdfDocument = new PdfDocument(writer);
            Document document= new Document(pdfDocument);
            document.add(new Paragraph("HOA DON MUA HÀNG :"));
            document.add(new Paragraph("MA HOA DON :"+hoaDonEntity.getMa()));
            document.add(new Paragraph("TEN KHACH HANG :"+hoaDonEntity.getUserEntity().getHoTen()));
            document.add(new Paragraph(("NGAY TAO :"+hoaDonEntity.getNgayTao())));
            document.add(new Paragraph("SO DIEN THOAI :"+hoaDonEntity.getUserEntity().getSoDienThoai()));
            document.add(new Paragraph("TONG TIEN :"+ hoaDonEntity.getTongTien()));
            document.close();
            return hoaDon1.toByteArray();
        }
        return null;
    }

    @Override
    public List<HoaDonEntity> getHoaDonByUserId(UUID userId) {
        return hoaDonRepository.findByUserId(userId);
    }

}
