package com.example.demo.cron_jobs;

import com.example.demo.service.GiamGiaHoaDonService;
import com.example.demo.service.GiamGiaSanPhamService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.client.utils.DateUtils;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;

@Slf4j
@Component
@RequiredArgsConstructor
public class GiamGiaSchedule {

  private final GiamGiaHoaDonService giamGiaHoaDonService;
  private final GiamGiaSanPhamService giamGiaSanPhamService;

  @Scheduled(fixedDelay = 86400) // Chạy mỗi ngày
  public void runGiamGiaScheduler() {
    try {
      log.info(
          "========== Bắt đầu check status của chương trình giảm giá: {} ==========", new Date());

      this.giamGiaHoaDonService.updateTrangThaiGiamGiaHoaDon();
      this.giamGiaSanPhamService.updateTrangThaiGimGiaSanPham();
      log.info(
          "========== Kết thúc check status của chương trình giảm giá: {} ==========", new Date());
    } catch (Exception e) {
      log.error("ERROR running runGiamGiaScheduler with message: {}", e);
    }
  }
}
