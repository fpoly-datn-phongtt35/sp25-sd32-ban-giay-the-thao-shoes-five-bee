package com.example.demo.controller;

import com.example.demo.dto.request.ChatLieuDto;
import com.example.demo.dto.request.ChatLieuUpdateDto;
import com.example.demo.dto.request.XuatXuUpdateDto;
import com.example.demo.entity.ChatLieuEntity;
import com.example.demo.entity.XuatXuEntity;
import com.example.demo.service.ChatLieuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chat-lieu")
public class ChatLieuController {
    @Autowired
    private ChatLieuService chatLieuService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/getAll")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(chatLieuService.getAll());
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/search")
    public ResponseEntity<?> findAndPageChatLieu(@RequestBody ChatLieuDto chatLieuDto){
        Pageable pageable = PageRequest.of(chatLieuDto.getPage(),chatLieuDto.getSize());
        return ResponseEntity.ok(chatLieuService.findByPagingCriteria(chatLieuDto,pageable));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody ChatLieuDto chatLieuDto){
        return ResponseEntity.ok(chatLieuService.add(chatLieuDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody ChatLieuUpdateDto chatLieuUpdateDto){
        return ResponseEntity.ok(chatLieuService.update(chatLieuUpdateDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/detail")
    public ResponseEntity<?> detail(@RequestBody ChatLieuUpdateDto chatLieuUpdateDto){
        return ResponseEntity.ok(chatLieuService.detail(chatLieuUpdateDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody ChatLieuUpdateDto chatLieuUpdateDto){
        return ResponseEntity.ok(chatLieuService.delete(chatLieuUpdateDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/addNhanh")
    public ResponseEntity<?> addNhanhChatLieu(@RequestBody ChatLieuDto chatLieuDto) {
        try {
            ChatLieuEntity chatLieu = chatLieuService.addNhanh(chatLieuDto);
            return ResponseEntity.ok(chatLieu);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/toggle-trangthai")
    public ChatLieuEntity toggleTrangThai(@RequestBody ChatLieuUpdateDto chatLieuUpdateDto) {
        return chatLieuService.toggleTrangThai(chatLieuUpdateDto);
    }
}
