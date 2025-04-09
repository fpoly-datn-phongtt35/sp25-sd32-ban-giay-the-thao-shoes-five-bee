package com.example.demo.controller;

import com.example.demo.service.SubscriptionService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/subscribe")
@RequiredArgsConstructor
public class SubscriptionController {
  private final SubscriptionService subscriptionService;

  @PostMapping()
  public ResponseEntity<?> subscribe(@RequestParam UUID id) {
    return ResponseEntity.ok(subscriptionService.subscribe(id));
  }
}
