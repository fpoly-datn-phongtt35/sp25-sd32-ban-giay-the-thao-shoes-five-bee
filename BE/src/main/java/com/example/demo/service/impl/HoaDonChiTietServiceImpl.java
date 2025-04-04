package com.example.demo.service.impl;

import com.example.demo.dto.request.BestSellingProductDTO;
import com.example.demo.dto.request.UpdateAddressBillRequest;
import com.example.demo.dto.request.UpdateQuantityRequest;
import com.example.demo.entity.DiaChiEntity;
import com.example.demo.entity.GiamGiaHoaDonChiTietEntity;
import com.example.demo.entity.HoaDonChiTietEntity;
import com.example.demo.entity.HoaDonEntity;
import com.example.demo.repository.DiaChiRepository;
import com.example.demo.repository.GiamGiaHoaDonChiTietRepository;
import com.example.demo.repository.HoaDonChiTietRepository;
import com.example.demo.repository.HoaDonRepository;
import com.example.demo.service.HoaDonChiTietService;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class HoaDonChiTietServiceImpl implements HoaDonChiTietService {

    @Autowired
    private final HoaDonChiTietRepository hoaDonChiTietRepository;
    @Autowired
    private HoaDonRepository hoaDonRepository;
    @Autowired
    private GiamGiaHoaDonChiTietRepository giamGiaHoaDonChiTietRepository;
    @Autowired
    private DiaChiRepository diaChiRepository;

    @Override
    public HoaDonEntity updateAddress(UUID idHoaDon, UpdateAddressBillRequest updateAddressBillRequest) {
        HoaDonEntity hoaDonEntity = hoaDonRepository.findById(idHoaDon)
                .orElseThrow(() -> new RuntimeException("hóa đơn không tồn tại"));
        hoaDonEntity.setDiaChi(updateAddressBillRequest.getDiaChi());
        hoaDonEntity.setXa(updateAddressBillRequest.getXa());
        hoaDonEntity.setHuyen(updateAddressBillRequest.getHuyen());
        hoaDonEntity.setTinh(updateAddressBillRequest.getTinh());
        return hoaDonRepository.save(hoaDonEntity);
    }

    @Override
    public HoaDonChiTietEntity updateQuantity(UUID id, UUID idGiayChiTiet, UpdateQuantityRequest updateQuantityRequest) {
        HoaDonChiTietEntity item = hoaDonChiTietRepository.findByHoaDonEntityIdAndGiayChiTietEntityId(id, idGiayChiTiet)
                .orElseThrow(() -> new RuntimeException("sản phẩm không tồn tại trong đơn hàng"));

        item.setSoLuong(updateQuantityRequest.getSoLuong());

        // cập nhật tổng tiền trong hóa đơn
        HoaDonEntity hoaDon = item.getHoaDonEntity();
        hoaDon.setTongTien(hoaDon.getItems().stream()
                .map(i -> i.getGiaBan().multiply(BigDecimal.valueOf(i.getSoLuong())))
                .reduce(BigDecimal.ZERO, BigDecimal::add));

        hoaDonRepository.save(hoaDon);
        return hoaDonChiTietRepository.save(item);
    }

    @Override
    public List<HoaDonChiTietEntity> findByHoaDonGetChiTiet(HoaDonEntity hoaDon) {
        return hoaDonChiTietRepository.findByHoaDonGetChiTiet(hoaDon);
    }

    @Override
    public byte[] printHoaDonChiTiet(UUID id) {
        Optional<HoaDonEntity> hoaDonEntity = hoaDonRepository.findById(id);
        if (hoaDonEntity.isPresent()) {
            HoaDonEntity hoaDonEntity1 = hoaDonEntity.get();
            List<HoaDonChiTietEntity> hoaDonChiTietEntities = hoaDonChiTietRepository.findAllByHoaDonEntity_Id(id);
            Optional<GiamGiaHoaDonChiTietEntity> optionalDiscount = giamGiaHoaDonChiTietRepository.findById(id);

            ByteArrayOutputStream hoaDon1 = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(hoaDon1);
            PdfDocument pdfDocument = new PdfDocument(writer);
            Document document = new Document(pdfDocument);

            document.add(new Paragraph("HOA DON MUA HÀNG :"));
            document.add(new Paragraph("MA HOA DON :" + hoaDonEntity1.getMa()));
            if (hoaDonEntity1.getUserEntity() != null) {
                document.add(new Paragraph("TEN KHACH HANG :" + hoaDonEntity1.getUserEntity().getHoTen()));
                document.add(new Paragraph("SO DIEN THOAI :" + hoaDonEntity1.getUserEntity().getSoDienThoai()));
            } else {
                document.add(new Paragraph("TEN KHACH HANG : KHACH LE"));
                document.add(new Paragraph("SO DIEN THOAI : N/A"));
            }
            document.add(new Paragraph("NGAY TAO :" + hoaDonEntity1.getNgayTao()));
            // Thông tin chi tiết từng sản phẩm trong hóa đơn
            for (HoaDonChiTietEntity chiTiet : hoaDonChiTietEntities) {
                document.add(new Paragraph("------------------------------------------------------"));
                document.add(new Paragraph("TEN SAN PHAM :" + chiTiet.getGiayChiTietEntity().getGiayEntity().getTen()));
                document.add(new Paragraph("SO LUONG :" + chiTiet.getSoLuong()));
                document.add(new Paragraph("DON GIA :" + chiTiet.getGiayChiTietEntity().getGiaBan()));
            }

            document.add(new Paragraph("------------------------------------------------------"));
            if (optionalDiscount.isPresent()) {
                GiamGiaHoaDonChiTietEntity discount = optionalDiscount.get();
                document.add(new Paragraph("TONG TIEN TRUOC GIAM : " + discount.getTongTien()));
                document.add(new Paragraph("SO TIEN DA GIAM : " + discount.getSoTienDaGiam()));
                document.add(new Paragraph("TONG TIEN SAU GIAM : " + discount.getTongTienThanhToan()));
                if (discount.getChuongTrinhGiamGiaHoaDonEntity() != null) {
                    document.add(new Paragraph("CHUONG TRINH GIAM GIA AP DUNG : " + discount.getChuongTrinhGiamGiaHoaDonEntity().getTen()));
                }
            } else {
                document.add(new Paragraph("TONG TIEN : " + hoaDonEntity1.getTongTien()));
            }

            document.close();
            return hoaDon1.toByteArray();
        }
        return null;
    }

    @Override
    public boolean capNhatDiaChi(UUID hoaDonId, UUID diaChiId) {
        Optional<HoaDonEntity> hoaDonEntityOpt = hoaDonRepository.findById(hoaDonId);
        Optional<DiaChiEntity> diaChiEntityOpt = diaChiRepository.findById(diaChiId);

        if (!hoaDonEntityOpt.isPresent()) {
            System.out.println("Không tìm thấy hóa đơn với ID: " + hoaDonId);
            return false;
        }

        if (!diaChiEntityOpt.isPresent()) {
            System.out.println("Không tìm thấy địa chỉ với ID: " + diaChiId);
            return false;
        }

        HoaDonEntity hoaDonEntity = hoaDonEntityOpt.get();
        DiaChiEntity diaChiEntity = diaChiEntityOpt.get();

        if (hoaDonEntity.getTrangThai() != 0) {
            System.out.println("Hóa đơn không ở trạng thái 0, không thể cập nhật!");
            return false;
        }

        // Cập nhật thông tin địa chỉ vào hóa đơn
        hoaDonEntity.setDiaChi(diaChiEntity.getTenDiaChi());
        hoaDonEntity.setXa(diaChiEntity.getXa());
        hoaDonEntity.setHuyen(diaChiEntity.getHuyen());
        hoaDonEntity.setTinh(diaChiEntity.getThanhPho());
        hoaDonEntity.setTenNguoiNhan(diaChiEntity.getTenNguoiNhan());
        hoaDonEntity.setSdtNguoiNhan(diaChiEntity.getSdtNguoiNhan());

        hoaDonRepository.save(hoaDonEntity);
        System.out.println("Cập nhật địa chỉ thành công cho hóa đơn: " + hoaDonId);
        return true;
    }

    @Override
    public List<BestSellingProductDTO> findTopSellingProductsWithVariants() {
        // Tạo PageRequest để lấy 5 sản phẩm bán chạy nhất
        PageRequest pageRequest = PageRequest.of(0, 5);  // Lấy 5 sản phẩm từ trang đầu tiên
        return hoaDonChiTietRepository.findTopSellingProductsWithVariants(pageRequest);
    }


}
