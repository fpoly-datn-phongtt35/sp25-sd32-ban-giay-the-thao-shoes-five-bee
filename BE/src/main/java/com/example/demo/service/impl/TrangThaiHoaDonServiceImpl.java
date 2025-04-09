package com.example.demo.service.impl;

import com.example.demo.dto.request.HoaDonDto;
import com.example.demo.dto.request.UserDto;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.service.LichSuHoaDonService;
import com.example.demo.service.SendMailService;
import com.example.demo.service.TrangThaiHoaDonService;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import java.io.ByteArrayOutputStream;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class TrangThaiHoaDonServiceImpl implements TrangThaiHoaDonService {
    @Autowired
    private HoaDonRepository hoaDonRepository;
    @Autowired
    private GioHangChiTietRepository gioHangChiTietRepository;
    @Autowired
    private GiayChiTietRepository giayChiTietRepository;
    @Autowired
    private GiayRepository giayRepository;
    @Autowired private LichSuHoaDonService lichSuHoaDonService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SendMailService sendMailService;

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
                lichSuHoaDonService.createLichSuHoaDon(id, 3,0);
                break;
            case 3:
                hoaDon.setTrangThai(4); // Đã xác nhận → Chờ vận chuyển
                lichSuHoaDonService.createLichSuHoaDon(id, 4,3);
                break;
            case 4:
                hoaDon.setTrangThai(5); // Chờ vận chuyển → Đang vận chuyển
                lichSuHoaDonService.createLichSuHoaDon(id, 5,4);
                break;
            case 5:
                hoaDon.setTrangThai(6); // Đang vận chuyển → Đã giao hàng
                lichSuHoaDonService.createLichSuHoaDon(id, 6,5);
                break;
            case 6:
                hoaDon.setTrangThai(2); // Đã giao hàng → Hoàn thành
                lichSuHoaDonService.createLichSuHoaDon(id, 2,6);
                // gửi email đánh giá khi đơn hàng hoàn thành
                sendDanhGiaEmail(hoaDon.getUserEntity().getId(),hoaDon.getId());
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

            updateTotalStock(giayChiTiet.getGiayEntity().getId());
        }
    }

    private void updateTotalStock(UUID idGiayEntity){
        List<GiayChiTietEntity> giayChiTietEntities = giayChiTietRepository.findByGiayEntityId(idGiayEntity);

        int totalStock = giayChiTietEntities.stream()
                .mapToInt(GiayChiTietEntity::getSoLuongTon)
                .sum();
        GiayEntity giayEntity = giayRepository.findById(idGiayEntity)
                .orElseThrow(() -> new RuntimeException("không tìm thấy sản phẩm "));
        giayEntity.setSoLuongTon(totalStock);
        giayRepository.save(giayEntity);
    }

    @Override
    public HoaDonEntity huyHoaDon(UUID id) {
        Optional<HoaDonEntity> hoaDonOpt = hoaDonRepository.findById(id);
        if (hoaDonOpt.isPresent()) {
            HoaDonEntity hoaDon = hoaDonOpt.get();
            lichSuHoaDonService.createLichSuHoaDon(id,8,hoaDon.getTrangThai());
            hoaDon.setTrangThai(8); // Đã hủy
            return hoaDonRepository.save(hoaDon);
        } else {
            throw new RuntimeException("Không tìm thấy hóa đơn với ID: " + id);
        }
    }

    @Override
    public List<HoaDonDto> getAllHoaDon() {
        List<HoaDonEntity> hoaDons = hoaDonRepository.findAll();
        // sắp xếp hóa đơn
        Collections.sort(hoaDons, (hd1, hd2) -> {
            boolean hd1IsOnlineWaiting = (hd1.getHinhThucThanhToan() != null && hd1.getHinhThucThanhToan() == 2) && hd1.getTrangThai() == 0;
            boolean hd2IsOnlineWaiting = (hd2.getHinhThucThanhToan() != null && hd2.getHinhThucThanhToan() == 2) && hd2.getTrangThai() == 0;

            // nếu hd1 là online và chờ xác nhận và hd2 không phải
            if (hd1IsOnlineWaiting && !hd2IsOnlineWaiting) {
                return -1;
            }

            // nếu hd2 là online và chờ xác nhận , hd1 không phải
            if (hd2IsOnlineWaiting && !hd1IsOnlineWaiting) {
                return 1;
            }

            // nếu hai hóa đơn cùng là hoặc đều không là online + chờ xác nhận, kiểm tra đã thanh toán
            if (hd1.getNgayThanhToan() != null && hd2.getNgayThanhToan() == null) {
                return -1; // hd1 lên trước
            }

            if (hd2.getNgayThanhToan() != null && hd1.getNgayThanhToan() == null) {
                return 1; // hd2 lên trước
            }

            // nếu cả hai cùng trạng thái thanh toán, sắp xếp theo ngày tạo mới nhất
            return hd2.getNgayTao().compareTo(hd1.getNgayTao());
        });

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

    public void sendDanhGiaEmail (UUID userId,UUID hoaDonId){
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("không tìm thấy user"));
        String email  = userEntity.getEmail();
        String subject = "Mời bạn đánh giá đơn hàng #" + hoaDonId;
        String body = "Chào " + userEntity.getHoTen() + ",\n\n"
                + "Cảm ơn bạn đã mua hàng! Đơn hàng của bạn đã hoàn thành. "
                + "Vui lòng để lại đánh giá về sản phẩm tại đường dẫn sau:\n"
                + "http://your-frontend.com/danh-gia/" + hoaDonId + "\n\n"
                + "Trân trọng,\nĐội ngũ hỗ trợ khách hàng.";

        sendMailService.sendMail(email, subject, body);
    }

    @Override
    public List<HoaDonEntity> getHoaDonByUserId(UUID userId) {
        return hoaDonRepository.findByUserId(userId);
    }

}
