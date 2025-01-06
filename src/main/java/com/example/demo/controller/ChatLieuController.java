package com.example.demo.controller;

import com.example.demo.dto.request.ChatLieuDto;
import com.example.demo.dto.request.ChatLieuUpdateDto;
import com.example.demo.service.ChatLieuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chat-lieu")
public class ChatLieuController {
    @Autowired
    private ChatLieuService chatLieuService;

    @PostMapping("/getAll")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(chatLieuService.getAll());
    }

    @PostMapping("/search")
    public ResponseEntity<?> findAndPageChatLieu(@RequestBody ChatLieuDto chatLieuDto){
        Pageable pageable = PageRequest.of(chatLieuDto.getPage(),chatLieuDto.getSize());
        return ResponseEntity.ok(chatLieuService.findByPagingCriteria(chatLieuDto,pageable));
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody ChatLieuDto chatLieuDto){
        return ResponseEntity.ok(chatLieuService.add(chatLieuDto));
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody ChatLieuUpdateDto chatLieuUpdateDto){
        return ResponseEntity.ok(chatLieuService.update(chatLieuUpdateDto));
    }

    @PostMapping("/detail")
    public ResponseEntity<?> detail(@RequestBody ChatLieuUpdateDto chatLieuUpdateDto){
        return ResponseEntity.ok(chatLieuService.detail(chatLieuUpdateDto));
    }

    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody ChatLieuUpdateDto chatLieuUpdateDto){
        return ResponseEntity.ok(chatLieuService.delete(chatLieuUpdateDto));
    }
}
