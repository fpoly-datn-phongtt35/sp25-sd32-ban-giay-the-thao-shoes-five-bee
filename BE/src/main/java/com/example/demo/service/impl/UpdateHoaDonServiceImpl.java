package com.example.demo.service.impl;

import com.example.demo.entity.GiayChiTietEntity;
import com.example.demo.entity.GiamGiaChiTietSanPhamEntity;
import com.example.demo.entity.HoaDonChiTietEntity;
import com.example.demo.entity.HoaDonEntity;
import com.example.demo.repository.GiayChiTietRepository;
import com.example.demo.repository.GiamGiaChiTietSanPhamRepository;
import com.example.demo.repository.HoaDonChiTietRepository;
import com.example.demo.repository.HoaDonRepository;

import com.example.demo.service.UpdateHoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

@Service
public class UpdateHoaDonServiceImpl implements UpdateHoaDonService {
    @Autowired
    private HoaDonRepository hoaDonRepository;

    @Autowired
    private HoaDonChiTietRepository hoaDonChiTietRepository;

    @Autowired
    private GiayChiTietRepository giayChiTietRepository;

    @Autowired
    private GiamGiaChiTietSanPhamRepository giamGiaChiTietSanPhamRepository;

    /**
     * Kiểm tra nếu hóa đơn không ở trạng thái "Chờ xác nhận" (0) thì không cho phép chỉnh sửa.
     */
    private void kiemTraTrangThaiHoaDon(HoaDonEntity hoaDon) {
        if (hoaDon.getTrangThai() != 0) {
            throw new IllegalStateException("Hóa đơn không ở trạng thái 'Chờ xác nhận', không thể chỉnh sửa.");
        }
    }

    /**
     * Cập nhật địa chỉ hóa đơn.
     */
    @Transactional
    @Override
    public HoaDonEntity updateHoaDonAddress(UUID hoaDonId, String tenNguoiNhan, String sdtNguoiNhan, String xa, String huyen, String tinh, String diaChi) {
        HoaDonEntity hoaDon = hoaDonRepository.findById(hoaDonId)
                .orElseThrow(() -> new IllegalArgumentException("Hóa đơn không tồn tại"));

        kiemTraTrangThaiHoaDon(hoaDon);

        hoaDon.setTenNguoiNhan(tenNguoiNhan);
        hoaDon.setSdtNguoiNhan(sdtNguoiNhan);
        hoaDon.setXa(xa);
        hoaDon.setHuyen(huyen);
        hoaDon.setTinh(tinh);
        hoaDon.setDiaChi(diaChi);

        return hoaDonRepository.save(hoaDon);
    }

    /**
     * Cập nhật số lượng sản phẩm trong hóa đơn.
     */
    @Transactional
    @Override
    public HoaDonChiTietEntity updateSoLuongSanPham(UUID idHoaDonChiTiet, boolean isIncrease) {
        HoaDonChiTietEntity hoaDonChiTiet = hoaDonChiTietRepository.findById(idHoaDonChiTiet)
                .orElseThrow(() -> new IllegalArgumentException("Hóa đơn chi tiết không tồn tại"));

        HoaDonEntity hoaDon = hoaDonChiTiet.getHoaDonEntity();
        kiemTraTrangThaiHoaDon(hoaDon); // Kiểm tra hóa đơn có ở trạng thái "Chờ xác nhận" không

        GiayChiTietEntity giayChiTiet = hoaDonChiTiet.getGiayChiTietEntity();
        int soLuongHienTai = hoaDonChiTiet.getSoLuong();
        int soLuongTon = giayChiTiet.getSoLuongTon();

        if (isIncrease) {
            if (soLuongTon <= 0) {
                throw new IllegalStateException("Không đủ hàng để tăng số lượng");
            }
            hoaDonChiTiet.setSoLuong(soLuongHienTai + 1);
            giayChiTiet.setSoLuongTon(soLuongTon - 1);
        } else {
            if (soLuongHienTai <= 1) {
                throw new IllegalStateException("Số lượng không thể nhỏ hơn 1");
            }
            hoaDonChiTiet.setSoLuong(soLuongHienTai - 1);
            giayChiTiet.setSoLuongTon(soLuongTon + 1);
        }

        // **Lưu thay đổi vào database**
        giayChiTietRepository.save(giayChiTiet);
        return hoaDonChiTietRepository.save(hoaDonChiTiet);
    }


    /**
     * Xóa sản phẩm khỏi hóa đơn.
     */
    @Transactional
    @Override
    public void removeSanPhamKhoiHoaDon(UUID hoaDonChiTietId) {
        HoaDonChiTietEntity hoaDonChiTiet = hoaDonChiTietRepository.findById(hoaDonChiTietId)
                .orElseThrow(() -> new IllegalArgumentException("Hóa đơn chi tiết không tồn tại"));

        HoaDonEntity hoaDon = hoaDonChiTiet.getHoaDonEntity();
        kiemTraTrangThaiHoaDon(hoaDon);

        GiayChiTietEntity giayChiTiet = hoaDonChiTiet.getGiayChiTietEntity();
        giayChiTiet.setSoLuongTon(giayChiTiet.getSoLuongTon() + hoaDonChiTiet.getSoLuong());
        giayChiTietRepository.save(giayChiTiet);

        hoaDonChiTietRepository.delete(hoaDonChiTiet);
    }

    /**
     * Thêm sản phẩm mới vào hóa đơn.
     */
    @Transactional
    @Override
    public HoaDonChiTietEntity themSanPhamVaoHoaDon(UUID idHoaDon, UUID idSanPham) {
        HoaDonEntity hoaDon = hoaDonRepository.findById(idHoaDon)
                .orElseThrow(() -> new IllegalArgumentException("Hóa đơn không tồn tại"));

        kiemTraTrangThaiHoaDon(hoaDon); // Kiểm tra trạng thái hóa đơn

        GiayChiTietEntity giayChiTiet = giayChiTietRepository.findById(idSanPham)
                .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại"));

        if (giayChiTiet.getSoLuongTon() <= 0) {
            throw new IllegalArgumentException("Sản phẩm đã hết hàng, không thể thêm vào hóa đơn");
        }

        // Kiểm tra xem sản phẩm đã có trong hóa đơn chưa
        HoaDonChiTietEntity hoaDonChiTiet = hoaDonChiTietRepository.findByHoaDonEntityAndGiayChiTietEntity(hoaDon, giayChiTiet);

        if (hoaDonChiTiet != null) {
            int newSoLuong = hoaDonChiTiet.getSoLuong() + 1;

            if (newSoLuong > giayChiTiet.getSoLuongTon()) {
                throw new IllegalArgumentException("Không đủ hàng để thêm vào hóa đơn");
            }

            // Cập nhật số lượng và giá tiền của sản phẩm đã tồn tại
            hoaDonChiTiet.setSoLuong(newSoLuong);
            hoaDonChiTiet.setDonGia(tinhGiaSauGiam(giayChiTiet).multiply(BigDecimal.valueOf(newSoLuong)));

            giayChiTiet.setSoLuongTon(giayChiTiet.getSoLuongTon() - 1);
            giayChiTietRepository.save(giayChiTiet);
            return hoaDonChiTietRepository.save(hoaDonChiTiet);
        }

        // Tính giá bán sau giảm giá nếu có chương trình khuyến mãi
        BigDecimal giaBanGoc = giayChiTiet.getGiaBan();
        BigDecimal giaSauGiam = tinhGiaSauGiam(giayChiTiet);

        // Tạo mới sản phẩm trong hóa đơn
        HoaDonChiTietEntity hoaDonChiTietEntity = HoaDonChiTietEntity.builder()
                .soLuong(1)
                .giaBan(giayChiTiet.getGiaBan())
                .donGia(giaSauGiam)
                .trangThai(1)
                .hoaDonEntity(hoaDon)
                .giayChiTietEntity(giayChiTiet)
                .build();

        giayChiTiet.setSoLuongTon(giayChiTiet.getSoLuongTon() - 1);
        giayChiTietRepository.save(giayChiTiet);

        return hoaDonChiTietRepository.save(hoaDonChiTietEntity);
    }


    /**
     * Tính giá sau khi áp dụng giảm giá (nếu có).
     */
    private BigDecimal tinhGiaSauGiam(GiayChiTietEntity giayChiTiet) {
        BigDecimal giaBanGoc = giayChiTiet.getGiaBan();

        GiamGiaChiTietSanPhamEntity giamGia =
                giamGiaChiTietSanPhamRepository.findByGiayChiTiet(giayChiTiet.getId());

        if (giamGia != null) {
            return giaBanGoc.subtract(giamGia.getSoTienDaGiam());
        }
        return giaBanGoc;
    }

}
