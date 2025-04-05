package com.example.demo.service.impl;

import com.example.demo.entity.GiayChiTietEntity;
import com.example.demo.entity.SubscriptionEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.repository.GiayChiTietRepository;
import com.example.demo.repository.SubcriptionRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.SendMailService;
import com.example.demo.service.SubscriptionService;
import com.example.demo.service.UsersService;
import java.sql.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {
  private final UsersService usersService;
  private final SendMailService sendMailService;
  private final GiayChiTietRepository giayChiTietRepository;
  private final SubcriptionRepository subcriptionRepository;
  private final UserRepository userRepository;

  @Override
  public SubscriptionEntity subscribe(UUID giayChiTietId) {
    return subcriptionRepository.save(
        SubscriptionEntity.builder()
            .userEntity(userRepository.findByEmail(usersService.getAuthenticatedUserEmail()).get())
            .giayChiTietEntity(giayChiTietRepository.findById(giayChiTietId).orElse(null))
            .subscribedAt(new Date(System.currentTimeMillis()))
            .build());
  }

  @Override
  public void notifyAllCustomersAboutProduct(UUID giayChiTietId) {
    GiayChiTietEntity giayChiTiet = giayChiTietRepository.findById(giayChiTietId).orElse(null);

    List<SubscriptionEntity> subscriptionEntityList =
        subcriptionRepository.findByGiayChiTietId(giayChiTietId);

    List<UserEntity> userEntities =
        subscriptionEntityList.stream().map(s -> s.getUserEntity()).collect(Collectors.toList());

    for (UserEntity userEntity : userEntities) {
      String subject = "Sản phẩm bạn quan tâm: " + giayChiTiet.getGiayEntity().getTen() + " trên website giày thể thao FiveBe";
      String body =
          "Chào "
              + userEntity.getHoTen()
              + ",\n\n"
              + "Tuyệt vời! Sản phẩm \""
              + giayChiTiet.getGiayEntity().getTen()
              + "\" mà bạn yêu thích đã có hàng trở lại. Đừng bỏ lỡ, ghé thăm website của chúng tôi và rinh ngay về nhà nhé!";
      //              +
      //              "Xem chi tiết tại: https://your-shop.com/products/" + product.getId()

      subcriptionRepository.deleteAll(subscriptionEntityList);
      sendMailService.sendMail(userEntity.getEmail(), body, subject);
    }
  }
}
