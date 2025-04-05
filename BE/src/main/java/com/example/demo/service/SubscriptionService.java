package com.example.demo.service;

import com.example.demo.entity.SubscriptionEntity;

import java.util.UUID;

public interface SubscriptionService {
    SubscriptionEntity subscribe(UUID giayChiTietId);
    void notifyAllCustomersAboutProduct(UUID giayChiTietId);
}
