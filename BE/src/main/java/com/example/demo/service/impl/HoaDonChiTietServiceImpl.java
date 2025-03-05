package com.example.demo.service.impl;

import com.example.demo.entity.GiamGiaHoaDonChiTietEntity;
import com.example.demo.entity.HoaDonChiTietEntity;
import com.example.demo.entity.HoaDonEntity;
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
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class HoaDonChiTietServiceImpl implements HoaDonChiTietService {

    @Autowired
    private final HoaDonChiTietRepository hoaDonChiTietRepository;
    @Autowired
    private HoaDonRepository hoaDonRepository;
    @Autowired
    private GiamGiaHoaDonChiTietRepository giamGiaHoaDonChiTietRepository;
    @Override
    public List<HoaDonChiTietEntity> findByHoaDonGetChiTiet(HoaDonEntity hoaDon) {
        return hoaDonChiTietRepository.findByHoaDonGetChiTiet(hoaDon);
    }

    @Override
    public byte[] printHoaDonChiTiet(UUID id) {
        Optional<HoaDonEntity> hoaDonEntity = hoaDonRepository.findById(id);
        if(hoaDonEntity.isPresent()){
            HoaDonEntity hoaDonEntity1 = hoaDonEntity.get();
            List<HoaDonChiTietEntity> hoaDonChiTietEntities = hoaDonChiTietRepository.findAllByHoaDon_Id(id);
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
}
