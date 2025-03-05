package com.example.demo.controller;

import com.example.demo.entity.HoaDonEntity;
import com.example.demo.service.TrangThaiHoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/trang-thai-hoa-don")
public class HoaDonController {
    @Autowired
    private TrangThaiHoaDonService trangThaiHoaDonService;
    @PutMapping("/xac-nhan/{id}")
    public HoaDonEntity xacNhanHoaDon(@PathVariable UUID id) {
        return trangThaiHoaDonService.xacNhanHoaDon(id);
    }
    // 0 cho xac nhan
    // 1 hoa don cho thanh toan
    // 2 hoan thanh
    // 3 da xac nhan
    // 4 cho van chuyen
    // 5 dang van chuyen
    // 6 da giao hang
    // 7 tra hang
    // 8 da huy

    /**
     * API hủy hóa đơn
     */
    @PutMapping("/{id}/huy")
    public HoaDonEntity huyHoaDon(@PathVariable UUID id) {
        return trangThaiHoaDonService.huyHoaDon(id);
    }
    @GetMapping("/getAll")
    public List<HoaDonEntity> getAllHoaDon() {
        return trangThaiHoaDonService.getAllHoaDon();
    }
    @GetMapping("/{id}")
    public ResponseEntity<HoaDonEntity> getHoaDonChiTiet(@PathVariable UUID id) {
        Optional<HoaDonEntity> hoaDon = trangThaiHoaDonService.findById(id);
        return hoaDon.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping("/download-pdf/{id}")
    public ResponseEntity<byte[]> downloadInvoicePdf(@PathVariable UUID id){
        byte[] pdfData = trangThaiHoaDonService.printHoaDon(id);
        if(pdfData != null){
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.add("Content-Disposition", "inline; filename=invoice_" + id + ".pdf");
            return new ResponseEntity<>(pdfData,httpHeaders, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
