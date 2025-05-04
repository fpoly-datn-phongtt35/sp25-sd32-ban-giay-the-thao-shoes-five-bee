package com.example.demo.controller;

import com.example.demo.dto.request.BestSellingProductDTO;
import com.example.demo.dto.request.UpdateAddressBillRequest;
import com.example.demo.dto.request.UpdateQuantityRequest;
import com.example.demo.entity.HoaDonChiTietEntity;
import com.example.demo.entity.HoaDonEntity;
import com.example.demo.repository.HoaDonRepository;
import com.example.demo.service.HoaDonChiTietService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/hoa-don-chi-tiet")
public class HoaDonChiTietController {
    @Autowired
    private HoaDonChiTietService hoaDonChiTietService;

    @Autowired
    private HoaDonRepository hoaDonRepository;

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('USER')" )
    @GetMapping("/{hoaDonId}")
    public ResponseEntity<List<HoaDonChiTietEntity>> getHoaDonChiTiet(@PathVariable UUID hoaDonId) {
        Optional<HoaDonEntity> hoaDon = hoaDonRepository.findById(hoaDonId);
        if (hoaDon.isPresent()) {
            List<HoaDonChiTietEntity> danhSachChiTiet = hoaDonChiTietService.findByHoaDonGetChiTiet(hoaDon.get());
            return ResponseEntity.ok(danhSachChiTiet);
        }
        return ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('USER')" )
    @PutMapping("/{idHoaDon}/address")
    public ResponseEntity<HoaDonEntity> updateAddress(@PathVariable UUID idHoaDon, @RequestBody UpdateAddressBillRequest updateAddressBillRequest){
        return ResponseEntity.ok(hoaDonChiTietService.updateAddress(idHoaDon,updateAddressBillRequest));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('USER')" )
    @PutMapping("/{id}/items/{idGiayChiTiet}/quantity")
    public ResponseEntity<HoaDonChiTietEntity> updateQuantity(
            @PathVariable UUID id,
            @PathVariable UUID idGiayChiTiet,
            @RequestBody UpdateQuantityRequest updateQuantityRequest
            ){
        return ResponseEntity.ok(hoaDonChiTietService.updateQuantity(id,idGiayChiTiet,updateQuantityRequest));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('USER')" )
    @PutMapping("/{hoaDonId}/update-address")
    public ResponseEntity<String> updateInvoiceAddress(@PathVariable UUID hoaDonId, @RequestParam UUID diaChiId) {
        boolean updated = hoaDonChiTietService.capNhatDiaChi(hoaDonId, diaChiId);
        if (updated) {
            return ResponseEntity.ok("Cập nhật địa chỉ thành công");
        }
        return ResponseEntity.badRequest().body("Không thể cập nhật địa chỉ");
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @GetMapping("/download-pdf-hdct/{id}")
    public ResponseEntity<byte[]> downloadInvoicePdf(@PathVariable UUID id){
        byte[] pdfData = hoaDonChiTietService.printHoaDonChiTiet(id);
        if (pdfData != null){
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.setContentType(MediaType.APPLICATION_PDF);
            httpHeaders.add("Content-Disposition", "inline; filename=invoice_" + id + ".pdf");
            return new ResponseEntity<>(pdfData,httpHeaders, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('USER')" )
    @GetMapping("/top-selling")
    public List<BestSellingProductDTO> getTop5BestSellingProducts() {
        return hoaDonChiTietService.findTopSellingProductsWithVariants();
    }
}
