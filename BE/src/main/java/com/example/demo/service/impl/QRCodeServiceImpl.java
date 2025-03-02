package com.example.demo.service.impl;

import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.service.QRCodeService;
import com.github.sarxos.webcam.Webcam;
import com.google.zxing.*;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.HybridBinarizer;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class QRCodeServiceImpl implements QRCodeService {
    private final GiayChiTietRepository giayChiTietRepository;
    private final HoaDonRepository hoaDonRepository;
    private final HoaDonChiTietRepository hoaDonChiTietRepository;
    private Webcam webcam;
    private final GiamGiaChiTietSanPhamRepository giamGiaChiTietSanPhamRepository;
    private final GiayRepository giayRepository;


    @Override
    public String scanAndAddToHoaDonCho(MultipartFile file) throws IOException {
        String maVach = scanQRCodeFromFile(file);
        return processQRCode(maVach);
    }

    @Override
    public String scanAndAddToHoaDonChoFromWebcam() {
        String maVach = scanQRCodeFromWebcam();
        return processQRCode(maVach);
    }

    private String processQRCode(String maVach) {
        if (maVach == null || maVach.trim().isEmpty()) {
            return "Không tìm thấy QR Code!";
        }

        // 📌 Tìm sản phẩm chi tiết (GiayChiTietEntity) theo mã vạch
        Optional<GiayChiTietEntity> optionalGiayChiTiet = giayChiTietRepository.findByMaVach(maVach);
        if (optionalGiayChiTiet.isEmpty()) {
            return "Sản phẩm không tồn tại!";
        }
        GiayChiTietEntity giayChiTiet = optionalGiayChiTiet.get();

        // 📌 Lấy giày tổng (GiayEntity)
        GiayEntity giay = giayChiTiet.getGiayEntity();
        if (giay == null) {
            return "Giày không hợp lệ!";
        }

        // 📌 Kiểm tra tồn kho trước khi thêm vào hóa đơn
        if (giayChiTiet.getSoLuongTon() <= 0) {
            return "Sản phẩm đã hết hàng!";
        }

        // 📌 Tìm hoặc tạo hóa đơn chờ
        HoaDonEntity hoaDonCho = hoaDonRepository.getListByTrangThai()
                .stream().findFirst()
                .orElseGet(this::createHoaDonMoi);

        // 📌 Kiểm tra xem sản phẩm đã có trong hóa đơn chưa
        HoaDonChiTietEntity hoaDonChiTiet = hoaDonChiTietRepository
                .findByHoaDonEntityAndGiayChiTietEntity(hoaDonCho, giayChiTiet);

        // 📌 Lấy giá bán gốc
        BigDecimal giaBanGoc = giayChiTiet.getGiaBan();
        BigDecimal giaSauGiam = Optional.ofNullable(
                        giamGiaChiTietSanPhamRepository.findByGiayChiTiet(giayChiTiet.getId()))
                .map(GiamGiaChiTietSanPhamEntity::getSoTienDaGiam)
                .map(giaBanGoc::subtract)
                .orElse(giaBanGoc);; // Tạm thời bỏ qua giảm giá

        if (hoaDonChiTiet != null) {
            // 📌 Nếu sản phẩm đã có, tăng số lượng
            int newSoLuong = hoaDonChiTiet.getSoLuong() + 1;
            if (newSoLuong > giayChiTiet.getSoLuongTon()) {
                return "Không đủ hàng để thêm!";
            }
            hoaDonChiTiet.setSoLuong(newSoLuong);

            // 📌 Cập nhật giá bán tổng theo số lượng mới
            hoaDonChiTiet.setGiaBan(giaBanGoc.multiply(BigDecimal.valueOf(newSoLuong)));
            hoaDonChiTiet.setDonGia(giaSauGiam.multiply(BigDecimal.valueOf(newSoLuong)));
        } else {
            // 📌 Nếu sản phẩm chưa có, thêm sản phẩm vào hóa đơn mới
            hoaDonChiTiet = HoaDonChiTietEntity.builder()
                    .soLuong(1)
                    .giaBan(giaBanGoc)
                    .donGia(giaSauGiam)
                    .trangThai(1)
                    .hoaDonEntity(hoaDonCho)
                    .giayChiTietEntity(giayChiTiet)
                    .build();
        }

        // 📌 Cập nhật tồn kho của `GiayChiTietEntity`
        giayChiTiet.setSoLuongTon(giayChiTiet.getSoLuongTon() - 1);
        giayChiTietRepository.save(giayChiTiet);

        // 📌 Cập nhật tổng `soLuongTon` của `GiayEntity`
        capNhatSoLuongTongGiay(giay);

        // 📌 Lưu dữ liệu hóa đơn chi tiết
        hoaDonChiTietRepository.save(hoaDonChiTiet);

        return "Sản phẩm đã được thêm vào hóa đơn chờ!";
    }
    private void capNhatSoLuongTongGiay(GiayEntity giay) {
        // 📌 Tính tổng số lượng tồn của tất cả `GiayChiTietEntity` của `GiayEntity` này
        int tongSoLuong = giayChiTietRepository.findByGiayEntity(giay)
                .stream().mapToInt(GiayChiTietEntity::getSoLuongTon).sum();

        // 📌 Cập nhật `soLuongTon` của giày tổng
        giay.setSoLuongTon(tongSoLuong);
        giayRepository.save(giay);
    }




    private boolean kiemTraTonKho(GiayChiTietEntity giayChiTiet, int soLuongMuonThem) {
        return giayChiTiet.getSoLuongTon() >= soLuongMuonThem;
    }


    private HoaDonEntity createHoaDonMoi() {
        HoaDonEntity newHoaDon = new HoaDonEntity();
        newHoaDon.setNgayTao(new java.util.Date());
        newHoaDon.setHinhThucMua(1);
        newHoaDon.setHinhThucNhanHang(1);
        newHoaDon.setPhiShip(BigDecimal.ZERO);
        newHoaDon.setTrangThai(1); // Hóa đơn chờ
        return hoaDonRepository.save(newHoaDon);
    }

    private String scanQRCodeFromFile(MultipartFile file) throws IOException {
        BufferedImage bufferedImage = ImageIO.read(file.getInputStream());
        if (bufferedImage == null) {
            return "Ảnh không hợp lệ hoặc không thể đọc!";
        }
        return decodeQRCode(bufferedImage);
    }

    private String scanQRCodeFromWebcam() {
        try {
            if (webcam == null) {
                webcam = Webcam.getDefault();
                if (webcam == null) {
                    return "Không tìm thấy webcam!";
                }
                webcam.open();
            }

            BufferedImage image = webcam.getImage();
            if (image == null) {
                return "Không thể lấy hình ảnh từ webcam!";
            }
            return decodeQRCode(image);
        } catch (Exception e) {
            return "Lỗi khi quét QR từ webcam: " + e.getMessage();
        }
    }

    private String decodeQRCode(BufferedImage image) {
        try {
            LuminanceSource source = new BufferedImageLuminanceSource(image);
            BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));
            Result result = new MultiFormatReader().decode(bitmap);
            return result.getText();
        } catch (NotFoundException e) {
            return "Không tìm thấy QR Code!";
        }
    }



    public void closeWebcam() {
        if (webcam != null && webcam.isOpen()) {
            webcam.close();
        }
    }//ok

}
